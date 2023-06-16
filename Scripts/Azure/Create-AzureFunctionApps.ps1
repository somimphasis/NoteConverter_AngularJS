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

function Create-Slot {
	param ([string]$slot,[string]$region)
	
	$slotSuffix = .\Get-EnvSuffix $slot
	$servicesResourceGroupName = "devapps-ms-" + $slot
	$appInsightsName = "devapps-production-ai-wnc$slotSuffix"
	
	$contentShare = "xerox-services$slotSuffix"
	$functionName = "xerox-wnc-$region$slotSuffix"
	$planName = "devapps-non-production-$region-asp"
	$storageAccountName = "xeroxservices" + $slot
	$keyVaultName = "xerox-wnc$slotSuffix"
	$keyVaultUrl = "https://xerox-wnc$slotSuffix.vault.azure.net"
	
	if ($slot -eq "prod") 
	{
		$planName = "devapps-production-$region-asp"
	}
	
	$appInsightsKey = (Get-AzureRmApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName).InstrumentationKey
		
	$subscriptionId = (Get-AzureRmSubscription -SubscriptionName $subscription).Id
	$serverFarmId = "/subscriptions/$subscriptionId/resourceGroups/$planResourceGroup/providers/Microsoft.Web/serverfarms/$planName"
	
	.\ConnectTo-Azure -Subscription "XAS Production" -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

	$storageAccountKeys = Get-AzureRmStorageAccountKey -ResourceGroupName $servicesResourceGroupName -AccountName $storageAccountName
	$storageAccountKey = $storageAccountKeys | Where-Object { $_.KeyName -eq "Key1" } | Select Value
	
	$storageAccountConnectionString = "DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=" + $storageAccountKey.Value
	
	.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

	$appSettings = @{
		"APPINSIGHTS_INSTRUMENTATIONKEY" = $appInsightsKey;
		"WNC:ErrorEmail:BlobContainerName" = "xerox-wnc-error-email";
		"WNC:ErrorEmail:QueueName" = "xerox-wnc-error-email";
		"WNC:SuccessEmail:BlobContainerName" = "xerox-wnc-success-email";
		"WNC:SuccessEmail:QueueName" = "xerox-wnc-success-email";
		"WNC:Validation:BlobContainerName" = "xerox-wnc-validation";
		"WNC:Validation:QueueName" = "xerox-wnc-validation";
		"WNC:Validation:MaxPages" = "10";
		"WNC:DownloadBaseUrl" = "https://wnc-web$slotSuffix.services.xerox.com/api/v1/txt";
		"Azure:KeyVault:Url" = $keyVaultUrl;
		"Azure:StorageConnectionString" = $storageAccountConnectionString;
		"AzureWebJobsDashboard" = $storageAccountConnectionString;
		"AzureWebJobsStorage" = $storageAccountConnectionString;
		"FUNCTION_APP_EDIT_MODE" = "readwrite";
		"FUNCTIONS_EXTENSION_VERSION" = "~2";
		"WEBSITE_FUNCTIONS_ARMCACHE_ENABLED" = "0";
	}

	New-AzureRmResource -ResourceType 'Microsoft.Web/Sites' -ResourceName $functionName -kind 'functionapp' -Location $regions[$region] -ResourceGroupName $resourceGroupName -Properties @{ serverFarmId = $serverFarmId; siteConfig = @{AlwaysOn = $true} } -force
	
	Start-Sleep 3

	Set-AzureRmWebApp -Name $functionName -ResourceGroupName $resourceGroupName -AppSettings $appSettings
	
	Start-Sleep 3

	Set-AzureRmWebApp -Name $functionName -ResourceGroupName $resourceGroupName -AssignIdentity $true
	
	Start-Sleep 3

	$app = Get-AzureRmWebApp -ResourceGroupName $resourceGroupName -Name $functionName
	
	Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $app.Identity.PrincipalId -PermissionsToKeys get,list -PermissionsToSecrets get,list -PermissionsToCertificates get,list -BypassObjectIdValidation
	
	Start-Sleep 3

}

foreach ($region in $regions.Keys) 
{
	Create-Slot "prod" $region

	if ($region -eq "use") {
		Create-Slot "dev" $region
		Create-Slot "test" $region
		Create-Slot "stage" $region
	}
}