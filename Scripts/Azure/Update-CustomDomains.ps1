#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey,
	[String]$planResourceGroup
)

$regions = .\Get-AllRegions $null

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$resourceGroupName = "devapps-wnc" 

$names = @(
	"devapps-production-wnc",
	"devapps-production-wnc-api"#,
	#"xerox-wnc-portal",
	#"xerox-wnc-portal-api",
	#"xerox-wnc-identity"
)

function Update-Slot {
	param ([string]$webAppName, [string]$slot, [string]$region)

	$slotSuffix = .\Get-EnvSuffix $slot
	$appName = "$webAppName-$region"
	$trafficManagerName = "tm-devapps-production-geo-wnc"
	$domainName = "wnc-web$slotSuffix.services.xerox.com"

	if ($webAppName -eq "devapps-production-wnc-api") {
		$trafficManagerName = "tm-devapps-production-geo-wnc-api"
		$domainName = "wnc-api$slotSuffix.services.xerox.com"
	}
		
	if ($slot -eq "prod") 
	{
		Set-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $appName -HostNames @("$appName$slotSuffix.azurewebsites.net","$trafficManagerName$slotSuffix.trafficmanager.net",$domainName)
	}
	else 
	{
		Set-AzureRmWebAppSlot -ResourceGroupName $resourceGroupName -Name $appName -Slot $slot -HostNames @("$appName$slotSuffix.azurewebsites.net",$domainName)
	}
}

foreach ($name in $names) {
	foreach ($region in $regions.Keys) 
	{
		Update-Slot $name "prod" $region

		if ($region -eq "use") {
			Update-Slot $name "dev" $region
			Update-Slot $name "test" $region
			Update-Slot $name "stage" $region
		}
	}
}