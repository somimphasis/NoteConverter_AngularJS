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

foreach ($region in $regions.Keys) 
{
	$resourceGroupName = $planResourceGroup
	$planName = "devapps-non-production-$region-asp"
	
	New-AzureRmAppServicePlan -ResourceGroupName $resourceGroupName -Name $planName -Location $regions[$region] -Tier "Standard" -WorkerSize "Small"

	$planName = "devapps-production-$region-asp"
	
	New-AzureRmAppServicePlan -ResourceGroupName $resourceGroupName -Name $planName -Location $regions[$region] -Tier "Standard" -WorkerSize "Small"
}