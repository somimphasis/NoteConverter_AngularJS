#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[SecureString]$servicePrincipalKey,
	[String]$nonProductionDatabasePassword,
	[String]$productionDatabasePassword
)

$resourceGroupName = "devapps-wnc"

.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$slots = @(
	"dev",
	"test",
	"stage",
	"prod"
)

foreach ($slot in $slots) {

	$slotSuffix = .\Get-EnvSuffix $slot

	$databasePassword = $nonProductionDatabasePassword
	$jobDatabaseName = "devapps-non-production-db-eu-ms$slotSuffix"
	$identityDatabaseName = "devapps-non-production-db-eu-wnc-identity$slotSuffix"
	$wncDatabaseName = "devapps-non-production-db-eu-wnc$slotSuffix"
	$databaseServerName = "devapps-non-production-eu-sqlserver"
	$databaseUsername = "devapp-non-production-sqladmin"

	if ($slot -eq "prod") {
		$databasePassword = $productionDatabasePassword
		$jobDatabaseName = "devapps-production-db-eu-ms$slotSuffix"
		$identityDatabaseName = "devapps-production-db-eu-wnc-identity$slotSuffix"
		$wncDatabaseName = "devapps-production-db-eu-wnc$slotSuffix"	
		$databaseServerName = "devapps-production-eu-sqlserver"
		$databaseUsername = "devapp-staging-sqladmin"
	}

	$developerIds = @{
		"dev" = "A552C6182C3423B43486D0A83EC1B461";
		"test" = "A552C6182C3423B43486D0A83EC1B461";
		"stage" = "97689a122e3c15703e6e2663a9b15142";
		"prod" = "97689a122e3c15703e6e2663a9b15142";
	}

	$developerId = $developerIds[$slot]

	$ssoManagerUrls = @{
		"dev" = "https://ssomanager-test.services.xerox.com/ssomanager";
		"test" = "https://ssomanager-test.services.xerox.com/ssomanager";
		"stage" = "https://ssomanager-test.services.xerox.com/ssomanager";
		"prod" = "https://ssomanager.services.xerox.com/ssomanager";
	}

	$ssoManagerUrl = $ssoManagerUrls[$slot]
	
	$b2cInstances = @{
		"dev" = "https://xeroxb2cdev.b2clogin.com";
		"test" = "https://xeroxb2cdev.b2clogin.com";
		"stage" = "https://xeroxb2cdev.b2clogin.com";
		"prod" = "https://xeroxb2cdev.b2clogin.com";
	}

	$b2cInstance = $b2cInstances[$slot]

	$keyVaultName = "xerox-wnc$slotSuffix"
	$storageAccountName = "xeroxservices" + $slot
	
	.\ConnectTo-Azure -Subscription "XAS Production" -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
	
	$storageAccountKeys = Get-AzureRmStorageAccountKey -ResourceGroupName "devapps-ms-$slot" -AccountName $storageAccountName
	$storageAccountKey = $storageAccountKeys | Where-Object { $_.KeyName -eq "Key1" } | Select Value
	
	$storageAccountConnectionString = "DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=" + $storageAccountKey.Value

	.\ConnectTo-Azure -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey
	
	$jobConnectionString = "Server=tcp:$databaseServerName.database.windows.net,1433;Initial Catalog=$jobDatabaseName;Persist Security Info=False;User ID=$databaseUsername;Password=$databasePassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
	$identityConnectionString = "Server=tcp:$databaseServerName.database.windows.net,1433;Initial Catalog=$identityDatabaseName;Persist Security Info=False;User ID=$databaseUsername;Password=$databasePassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
	$wncConnectionString = "Server=tcp:$databaseServerName.database.windows.net,1433;Initial Catalog=$wncDatabaseName;Persist Security Info=False;User ID=$databaseUsername;Password=$databasePassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

	$secrets = @{
		"Azure--JobConnectionString" = $jobConnectionString;
		"Azure--StorageConnectionString" = $storageAccountConnectionString;
		"Azure--UpdateGallery--DeveloperId" = $developerId;
		"Azure--WorkflowUrl" = "https://audiodocs-workflow$slotSuffix.services.xerox.com";
		"Azure--Auth--Url" = "https://audiodocs-identity$slotSuffix.services.xerox.com";
		"Identity--ConnectionString" = $identityConnectionString;
		"OpenId--Authority" = "https://audiodocs-identity$slotSuffix.services.xerox.com";
		"IdentityServiceUrl" = "https://audiodocs-identity$slotSuffix.services.xerox.com";
		"Services--EmailSenderUrl" = "https://audiodocs-workflow$slotSuffix.services.xerox.com/send-email";
		"Portal--Url" = "https://audiodocs-portal-api$slotSuffix.services.xerox.com";
		"WNC--ConnectionString" = $wncConnectionString;
		"Cors--Origins" = "http://wnc-portal$slotSuffix.services.xerox.com,https://wnc-portal$slotSuffix.services.xerox.com,http://wnc-web$slotSuffix.services.xerox.com,https://wnc-web$slotSuffix.services.xerox.com";
		"WebPortal--ResetPasswordUrl" = "https://wnc-portal$slotSuffix.services.xerox.com/index.html#!/passwordReset";
		"WebPortal--CreateAccountUrl" = "https://wnc-portal$slotSuffix.services.xerox.com/index.html#!/createAccount";
		"SSO--AppId" = "5e78aa4c-a831-448b-a3d1-dc9a186f8149";
		"SSO--ManagerUrl" = $ssoManagerUrl;
		"WNC--Validation--MaxPages" = 10;
		"WNC--DownloadBaseUrl" = "https://wnc-web$slotSuffix.services.xerox.com/api/v1/txt";
		"Identity--WsFederation--CookieDomain" = ".services.xerox.com";
	    "WNC--Api--Cors--Origins" = "http://wnc-web$slotSuffix.services.xerox.com,https://wnc-web$slotSuffix.services.xerox.com,http://wnc-portal$slotSuffix.services.xerox.com,https://wnc-portal$slotSuffix.services.xerox.com,$b2cInstance";
		"WNC--Web--Cors--Origins" = "http://wnc-portal$slotSuffix.services.xerox.com,https://wnc-portal$slotSuffix.services.xerox.com,$b2cInstance";
	}

	foreach ($secret in $secrets.Keys) {
		$secretValue = ConvertTo-SecureString $secrets[$secret] -AsPlainText -Force
		Set-AzureKeyVaultSecret -VaultName $keyVaultName -Name $secret -SecretValue $secretValue
	}
}