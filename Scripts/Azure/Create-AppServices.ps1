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

function Create-Slot {
	param ([string]$webAppName, [string]$slot, [string]$region)

	$slotSuffix = .\Get-EnvSuffix $slot
	$appName = "$webAppName-$region"
	$planName = "devapps-non-production-$region-asp"
	$nonProductionPlanName = "devapps-non-production-$region-asp"
	$appInsightsName = "devapps-production-ai-wnc$slotSuffix"
	$keyVaultName = "xerox-wnc$slotSuffix"
	$trafficManagerName = "tm-devapps-production-geo-wnc"
	$regionString = $regions[$region]
	
	if ($slot -eq "prod") {
		$planName = "devapps-production-$region-asp"
	}

	if ($webAppName -eq "devapps-production-wnc-api") {
		$trafficManagerName = "tm-devapps-production-geo-wnc-api"
	}
		
	$subscriptionId = (Get-AzureRmSubscription -SubscriptionName $subscription).Id
	$serverFarmId = "/subscriptions/$subscriptionId/resourceGroups/$planResourceGroup/providers/Microsoft.Web/serverfarms/$planName"
	$appInsightsKey = (Get-AzureRmApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName).InstrumentationKey

	$settings = @{
		"APPINSIGHTS_INSTRUMENTATIONKEY" = $appInsightsKey;
		"APPINSIGHTS_PROFILERFEATURE_VERSION" = "1.0.0";
		"ApplicationInsightsAgent_EXTENSION_VERSION" = "~2";
		"Azure:KeyVault:Url" = "https://xerox-wnc$slotSuffix.vault.azure.net";
		"Azure:KeyVault:Cert:Url" = "https://XAGProductionKeyVault.vault.azure.net";
		"Azure:KeyVault:ClientId" = "7bec0f2d-36ad-40c0-b331-7e6fa733051d";
		"Azure:KeyVault:ClientSecret" = "lfkDNzSUgrcZ8ULisp+eJx4oOyBzn2FPNMJQHZJ3Thk=";
		"DiagnosticServices_EXTENSION_VERSION" = "~3";
	}

	if ($slot -eq "prod") 
	{
		New-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $appName -Location $regionString -AppServicePlan $serverFarmId
		
		Start-Sleep 3

		Set-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $appName -AppSettings $settings
		
		Start-Sleep 3

		Set-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $appName -AssignIdentity $true
		
		Start-Sleep 3

		$app = Get-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $appName
	
		Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $app.Identity.PrincipalId -PermissionsToKeys get,list -PermissionsToSecrets get,list -PermissionsToCertificates get,list -BypassObjectIdValidation	
	}
	else 
	{
		New-AzureRmWebAppSlot -ResourceGroupName $resourceGroupName -Name $appName -Slot $slot -AppServicePlan $serverFarmId
		
		Start-Sleep 3

		Set-AzureRmWebAppSlot -ResourceGroupName $resourceGroupName -Name $appName -Slot $slot -AppSettings $settings
		
		Start-Sleep 3

		Set-AzureRmWebAppSlot -ResourceGroupName $resourceGroupName -Name $appName -Slot $slot -AssignIdentity $true
		
		Start-Sleep 3

		$app = Get-AzureRmWebAppSlot -ResourceGroupName $resourceGroupName -Name $appName -Slot $slot
	
		Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $app.Identity.PrincipalId -PermissionsToKeys get,list -PermissionsToSecrets get,list -PermissionsToCertificates get,list -BypassObjectIdValidation	
	}

	$stickySlot = @()

	foreach ($setting in $settings.Keys) {
		$stickySlot += $setting
	}
	
	Start-Sleep 3

	Set-AzureRmWebAppSlotConfigName -ResourceGroupName $resourceGroupName -Name $appName -AppSettingNames $stickySlot
	
	Start-Sleep 3

}

foreach ($name in $names) {
	foreach ($region in $regions.Keys) 
	{
		Create-Slot $name "prod" $region

		if ($region -eq "use") {
			Create-Slot $name "dev" $region
			Create-Slot $name "test" $region
			Create-Slot $name "stage" $region
		}
	}
}