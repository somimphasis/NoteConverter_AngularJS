#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey,
	[String]$planResourceGroup,
	[String]$nonProductionDatabasePassword,
	[String]$productionDatabasePassword
)

#./Create-QueuesAndStorageContainers -Subscription "XAS Production" -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
#./Create-PrivacyPolicyAndEULA       -Subscription "XAS Production" -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
#./Create-AppServicePlans            -Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey -PlanResourceGroup $planResourceGroup
./Create-ApplicationInsights		-Subscription $subscription	   -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
./Create-KeyVaults					-Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
./Update-KeyVaults					-Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey -NonProductionDatabasePassword $nonProductionDatabasePassword -ProductionDatabasePassword $productionDatabasePassword
./Create-AzureFunctionApps			-Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey -PlanResourceGroup $planResourceGroup
./Create-AppServices				-Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey -PlanResourceGroup $planResourceGroup
./Create-TrafficManagers            -Subscription $subscription    -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey