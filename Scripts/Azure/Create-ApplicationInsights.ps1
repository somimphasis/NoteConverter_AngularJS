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
	$appInsightsName = "devapps-production-ai-wnc$slotSuffix"

	New-AzureRmApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location "North Europe"
}