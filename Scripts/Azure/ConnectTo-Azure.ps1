#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey
)

#Connect to azure
$azureADCred = New-Object System.Management.Automation.PSCredential ($applicationId, $servicePrincipalKey)
Connect-AzureRmAccount -Environment AzureCloud -Credential $azureADCred -ServicePrincipal -TenantId $tenantId -Subscription $subscription