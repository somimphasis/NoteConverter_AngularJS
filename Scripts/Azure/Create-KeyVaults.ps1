#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey
)

$resourceGroupName = "devapps-wnc"

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$slots = @(
	"dev",
	"test",
	"stage",
	"prod"
)

foreach ($slot in $slots) 
{
	$slotSuffix = .\Get-EnvSuffix $slot
	$keyVaultName = "xerox-wnc$slotSuffix"
	
	New-AzureRmKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location "North Europe"
	
	Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ServicePrincipalName $applicationId -PermissionsToKeys get,list,update,create,import,delete,recover,backup,restore -PermissionsToSecrets get,list,set,delete,recover,backup,restore -PermissionsToCertificates get,list,update,create,import,delete,recover,backup,restore -PassThru
	Set-AzureRmKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId "be4be714-b180-4aa5-b5f4-52b6f7926394" -PermissionsToKeys get,list,update,create,import,delete,recover,backup,restore -PermissionsToSecrets get,list,set,delete,recover,backup,restore -PermissionsToCertificates get,list,update,create,import,delete,recover,backup,restore -PassThru -BypassObjectIdValidation
}