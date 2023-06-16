#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$env = "prod", 
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[String]$servicePrincipalKeyPlainText,
	[String]$tag,
	[String]$scriptDir,
	[String]$singleRegion = $null
)

$servicePrincipalKey = ConvertTo-SecureString $servicePrincipalKeyPlainText -AsPlainText -Force
$workingDir = Get-Location
$envSuffix = .\Get-EnvSuffix $env

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$containers = @{
	"xerox-wnc-identity"   = @{ "csproj" = ""; "AppInsightsName" = "xerox-wnc$envSuffix-ai"; "ContainerSourceName" = "xerox-services-identity" };
	"xerox-wnc-portal-api" = @{ "csproj" = ""; "AppInsightsName" = "xerox-wnc$envSuffix-ai"; "ContainerSourceName" = "xerox-services-portal"   };
}

foreach ($containerKey in $containers.Keys) 
{
	$csproj = $containers[$containerKey]["csproj"]
	$appInsightsName = $containers[$containerKey]["AppInsightsName"]
	$containerSourceName = $containers[$containerKey]["ContainerSourceName"]

	Start-Job -FilePath "$scriptDir/_Written Note Conversion/Scripts/Azure/Create-Container.ps1" -ArgumentList $env, $subscription, $tenantId, $applicationId, $servicePrincipalKeyPlainText, $workingDir, $containerKey, $containerSourceName, $appInsightsName, $tag, $scriptDir, $singleRegion
}

Start-Sleep 10

while ($true) {
    Start-Sleep 2
	Get-Job | Receive-Job

	$continue = $false

	foreach ($containerKey in $containers.Keys) {
		if (Test-Path -Path "$containerKey.lock") {
			$continue = $true
			break
		}
	}

	if (!$continue) { break }
}