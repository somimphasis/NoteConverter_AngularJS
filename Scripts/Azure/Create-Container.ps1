#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$env = "prod", 
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[String]$servicePrincipalKeyPlainText,
	[String]$workingDir,
	[String]$containerKey,
	[String]$containerSourceName,
	[String]$appInsightsName,
	[String]$imageTag,
	[String]$scriptDir,
	[String]$singleRegion = $null
)

Set-Content -Path "$workingDir\$containerKey.lock" -Value "Something"

$scriptPath = "$scriptDir/_Written Note Conversion/Xerox.Wnc/Scripts/Azure"

$envSuffix = (& "$scriptPath\Get-EnvSuffix.ps1" $env)
$regions = (& "$scriptPath\Get-Regions.ps1" $singleRegion)
$servicePrincipalKey = ConvertTo-SecureString $servicePrincipalKeyPlainText -AsPlainText -Force
$azureADCred = New-Object System.Management.Automation.PSCredential ($applicationId, $servicePrincipalKey)

$regionsExt = @{
	"us" = @("East US", "eastus");
	"eu" = @("North Europe", "northeurope");
}

& "$scriptPath\ConnectTo-Azure.ps1" -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$resourceGroupName = "devapps-wnc-" + $env

foreach ($region in $regions.Keys) {

	$location = $regionsExt[$region][1]
	$trafficManagerName = "$containerKey$envSuffix"
	$containerName = "$containerKey$envSuffix-$region"
	$endpointName = "$containerName.$location.azurecontainer.io"
	$registryName = "xeroxservicesweb.azurecr.io"
	$image = $registryName + "/" + $containerSourceName.Replace("-", "") + ":$imageTag"
	
	$appInsightsKey = (Get-AzureRmApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName).InstrumentationKey

	Disable-AzureRmTrafficManagerEndpoint -Name $endpointName -ProfileName $trafficManagerName -ResourceGroupName $resourceGroupName -Type ExternalEndpoints -Force
	
	$environmentVariables = @{
		"Azure__KeyVault__Url"="https://xerox-wnc$envSuffix-$region.vault.azure.net";
		"Azure__KeyVault__Cert__Url"="https://XAGProductionKeyVault.vault.azure.net";
		"Azure__KeyVault__ClientId"=$applicationId;
		"Azure__KeyVault__ClientSecret"=$servicePrincipalKeyPlainText;
		"ApplicationInsights__InstrumentationKey"="$appInsightsKey"
	}
	
	if(Get-AzureRmContainerGroup -ResourceGroupName $resourceGroupName -Name $containerName -ErrorAction SilentlyContinue)
	{
		Remove-AzureRmContainerGroup -ResourceGroupName $resourceGroupName -Name $containerName
	}

	New-AzureRmContainerGroup -ResourceGroupName $resourceGroupName -Name $containerName -Image $image -DnsNameLabel $containerName -Location $location -OsType Windows -IpAddressType public -Port @(80,443) -EnvironmentVariable $environmentVariables -RegistryServer $registryName -RegistryCredential $azureADCred

	$running = $false

	$seconds = 0
	$delay = 45

	while (!$running) {
		Start-Sleep 2

		$seconds += 2

		$status = Get-AzureRmContainerGroup -ResourceGroupName $resourceGroupName -Name $containerName
		$state = $status.State

		$secondsPadded = ([string]$seconds).PadLeft(3,'0')
		$delayPadded = ([string]$delay).PadLeft(2,'0')

		Write-Output "state=$state elapsed=${secondsPadded}s countdown=${delayPadded}s $containerName"

		if ($status.state -eq "Running") {
			if ($delay -lt 0) {
				$running = $true
			} else {
				$delay -= 2
			}
		}
	}

	$ipAddress = (Get-AzureRmContainerGroup -ResourceGroupName $resourceGroupName -Name $containerName).IpAddress
	$endpoint = (Get-AzureRmTrafficManagerEndpoint -ResourceGroupName $resourceGroupName -ProfileName $trafficManagerName -Name $endpointName -Type ExternalEndpoints)

	$endpoint.Target = $ipAddress

	Set-AzureRmTrafficManagerEndpoint -TrafficManagerEndpoint $endpoint

	Enable-AzureRmTrafficManagerEndpoint -Name $endpointName -ProfileName $trafficManagerName -ResourceGroupName $resourceGroupName -Type ExternalEndpoints
}

Remove-Item -Path "$workingDir\$containerKey.lock"