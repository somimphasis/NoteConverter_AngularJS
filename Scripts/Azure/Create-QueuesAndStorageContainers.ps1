#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$env = "prod", 
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey
)

$envSuffix = .\Get-EnvSuffix $env
$resourceGroupName = "devapps-ms-" + $env
$storageAccountName = "xeroxservices" + $env

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$containers = @(
	"xerox-wnc-validation",
	"xerox-wnc-error-email",
	"xerox-wnc-success-email"
)

$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName
	
foreach ($container in $containers) 
{
	if(!(Get-AzureStorageContainer -Name $container -Context $storageAccount.Context -ErrorAction SilentlyContinue))
	{
		New-AzureStorageContainer -Name $container -Context $storageAccount.Context
	}
	
	if(!(Get-AzureStorageQueue -Name $container -Context $storageAccount.Context -ErrorAction SilentlyContinue))
	{
		New-AzureStorageQueue -Name $container -Context $storageAccount.Context
	}
}