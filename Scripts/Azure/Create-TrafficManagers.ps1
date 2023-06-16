#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey
)

$regions = .\Get-AllRegions $null

$regionsExt = @{
	"use" = @("East US", "eastus");
	"uss" = @("Central US", "centralus");
	"eun" = @("North Europe", "northeurope");
	"euw" = @("West Europe", "westeurope");
}

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$resourceGroupName = "devapps-wnc"

$names = @(
	"devapps-production-wnc",
	"devapps-production-wnc-api"#,
	#"xerox-wnc-portal",
	#"xerox-wnc-portal-api",
	#"xerox-wnc-identity"
)

$slots = @(
	#"dev",
	#"test",
	#"stage",
	"prod"
)

foreach ($name in $names) {
	foreach ($slot in $slots) {
		$slotSuffix = .\Get-EnvSuffix $slot
		$subscriptionId = (Get-AzureRmSubscription -SubscriptionName $subscription).Id

		$euTrafficManagerName = "tm-devapps-production-perf-eu-wnc$slotSuffix"
		$usTrafficManagerName = "tm-devapps-production-perf-us-wnc$slotSuffix"
		$geoTrafficManagerName = "tm-devapps-production-geo-wnc$slotSuffix"

		if ($name -eq "devapps-production-wnc-api") {
			$euTrafficManagerName = "tm-devapps-production-perf-eu-wnc-api$slotSuffix"
			$usTrafficManagerName = "tm-devapps-production-perf-us-wnc-api$slotSuffix"
			$geoTrafficManagerName = "tm-devapps-production-geo-wnc-api$slotSuffix"
		}

		if ($slot -eq "prod") {
			$webAppSlot = ""
		} else {
			$webAppSlot = "/slots/" + $slot
		}



		New-AzureRmTrafficManagerProfile -ResourceGroupName $resourceGroupName -Name $euTrafficManagerName -ProfileStatus Enabled -TrafficRoutingMethod Performance -RelativeDnsName $euTrafficManagerName -TTL 30 -MonitorProtocol HTTPS -MonitorPort 443 -MonitorPath "/HealthCheck"
		
		Start-Sleep 3

		$webAppName = "$name-euw"
		$endpointName = "$webAppName$slotSuffix"
		$endpoint = "$endpointName.azurewebsites.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webAppName$webAppSlot"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $euTrafficManagerName -ResourceGroupName $resourceGroupName -Type AzureEndpoints -TargetResourceId $resourceId
	
		Start-Sleep 3

		$webAppName = "$name-eun"
		$endpointName = "$webAppName$slotSuffix"
		$endpoint = "$endpointName.azurewebsites.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webAppName$webAppSlot"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $euTrafficManagerName -ResourceGroupName $resourceGroupName -Type AzureEndpoints -TargetResourceId $resourceId
	
		Start-Sleep 3




		New-AzureRmTrafficManagerProfile -ResourceGroupName $resourceGroupName -Name $usTrafficManagerName -ProfileStatus Enabled -TrafficRoutingMethod Performance -RelativeDnsName $usTrafficManagerName -TTL 30 -MonitorProtocol HTTPS -MonitorPort 443 -MonitorPath "/HealthCheck"
		
		Start-Sleep 3

		$webAppName = "$name-use"
		$endpointName = "$webAppName$slotSuffix"
		$endpoint = "$endpointName.azurewebsites.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webAppName$webAppSlot"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $usTrafficManagerName -ResourceGroupName $resourceGroupName -Type AzureEndpoints -TargetResourceId $resourceId
		
		Start-Sleep 3

		$webAppName = "$name-uss"
		$endpointName = "$webAppName$slotSuffix"	
		$endpoint = "$endpointName.azurewebsites.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Web/sites/$webAppName$webAppSlot"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $usTrafficManagerName -ResourceGroupName $resourceGroupName -Type AzureEndpoints -TargetResourceId $resourceId
	
		Start-Sleep 3



	
		New-AzureRmTrafficManagerProfile -ResourceGroupName $resourceGroupName -Name $geoTrafficManagerName -ProfileStatus Enabled -TrafficRoutingMethod Geographic -RelativeDnsName $geoTrafficManagerName -TTL 30 -MonitorProtocol HTTPS -MonitorPort 443 -MonitorPath "/HealthCheck"
		
		Start-Sleep 3

		$endpointName = $usTrafficManagerName
		$endpoint = "$endpointName.trafficmanager.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Network/trafficManagerProfiles/$endpointName"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $geoTrafficManagerName -ResourceGroupName $resourceGroupName -Type NestedEndpoints -TargetResourceId $resourceId	-GeoMapping "GEO-NA"
	
		Start-Sleep 3

		$endpointName = $euTrafficManagerName
		$endpoint = "$endpointName.trafficmanager.net"
		$resourceId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Network/trafficManagerProfiles/$endpointName"

		New-AzureRmTrafficManagerEndpoint -EndpointStatus Enabled -Name $endpoint -ProfileName $geoTrafficManagerName -ResourceGroupName $resourceGroupName -Type NestedEndpoints -TargetResourceId $resourceId -GeoMapping "WORLD"
		
		Start-Sleep 3

	}
}