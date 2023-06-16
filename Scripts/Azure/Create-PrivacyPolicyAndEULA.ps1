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

$shareName = "xerox-wnc"
$privacyPolicyPath = "privacy-policy"
$tosCkPath = "terms-of-service-ck"
$tosIOSPath = "terms-of-service-ios"
$tosAndroidPath = "terms-of-service-android"

$privacyPolicyFiles = @{
	"wnc_pt" = "wnc_pt";
	"wnc_ca" = "wnc_ca";
	"wnc_cs" = "wnc_cs";
	"wnc_da" = "wnc_da";
	"wnc_nl" = "wnc_nl";
	"wnc_en" = "wnc_en";
	"wnc_fi" = "wnc_fi";
	"wnc_fr" = "wnc_fr";
	"wnc_de" = "wnc_de";
	"wnc_el" = "wnc_el";
	"wnc_hu" = "wnc_hu";
	"wnc_it" = "wnc_it";
	"wnc_no" = "wnc_no";
	"wnc_pl" = "wnc_pl";
	"wnc_ro" = "wnc_ro";
	"wnc_ru" = "wnc_ru";
	"wnc_es" = "wnc_es";
	"wnc_sv" = "wnc_sv";
	"wnc_tr" = "wnc_tr";
}

$eulaFiles = @{
	"eula-brazilian-portuguese" = "wnc_pt";
	"eula-catalan" = "wnc_ca";
	"eula-czech" = "wnc_cs";
	"eula-danish" = "wnc_da";
	"eula-dutch" = "wnc_nl";
	"eula-english" = "wnc_en";
	"eula-finnish" = "wnc_fi";
	"eula-french" = "wnc_fr";
	"eula-german" = "wnc_de";
	"eula-greek" = "wnc_el";
	"eula-hungarian" = "wnc_hu";
	"eula-italian" = "wnc_it";
	"eula-norwegian" = "wnc_no";
	"eula-polish" = "wnc_pl";
	"eula-romanian" = "wnc_ro";
	"eula-russian" = "wnc_ru";
	"eula-spanish" = "wnc_es";
	"eula-swedish" = "wnc_sv";
	"eula-turkish" = "wnc_tr";
}

$storageAccount = Get-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName

if (!(Get-AzureStorageShare -Name $shareName -Context $storageAccount.Context -ErrorAction SilentlyContinue))
{
	New-AzureStorageShare -Name $shareName -Context $storageAccount.Context
}

if (!(Get-AzureStorageFile -Path $privacyPolicyPath -ShareName $shareName -Context $storageAccount.Context -ErrorAction SilentlyContinue))
{
	New-AzureStorageDirectory -Path $privacyPolicyPath -ShareName $shareName -Context $storageAccount.Context
}

if (!(Get-AzureStorageFile -Path $tosCkPath -ShareName $shareName -Context $storageAccount.Context -ErrorAction SilentlyContinue))
{
	New-AzureStorageDirectory -Path $tosCkPath -ShareName $shareName -Context $storageAccount.Context
}

if (!(Get-AzureStorageFile -Path $tosIOSPath -ShareName $shareName -Context $storageAccount.Context -ErrorAction SilentlyContinue))
{
	New-AzureStorageDirectory -Path $tosIOSPath -ShareName $shareName -Context $storageAccount.Context
}

if (!(Get-AzureStorageFile -Path $tosAndroidPath -ShareName $shareName -Context $storageAccount.Context -ErrorAction SilentlyContinue))
{
	New-AzureStorageDirectory -Path $tosAndroidPath -ShareName $shareName -Context $storageAccount.Context
}

foreach ($privacyPolicyFileName in $privacyPolicyFiles.Keys) {
	Set-AzureStorageFileContent -Context $storageAccount.Context -ShareName $shareName -Source "../../../Documents/PrivacyPolicies/$privacyPolicyFileName.html" -Path ("$privacyPolicyPath\" + $privacyPolicyFiles[$privacyPolicyFileName] + ".html") -Force
}

foreach ($eulaFileName in $eulaFiles.Keys) {
	Set-AzureStorageFileContent -Context $storageAccount.Context -ShareName $shareName -Source "../../../Xerox.Wnc/Xerox.Wnc.Weblet/xas/EULAs/$eulaFileName.txt" -Path ("$tosCkPath\" + $eulaFiles[$eulaFileName] + ".txt") -Force

	Set-AzureStorageFileContent -Context $storageAccount.Context -ShareName $shareName -Source "../../../Documents/Mobile EULAs/ios/$eulaFileName.txt" -Path ("$tosIOSPath\" + $eulaFiles[$eulaFileName] + ".txt") -Force
	Set-AzureStorageFileContent -Context $storageAccount.Context -ShareName $shareName -Source "../../../Documents/Mobile EULAs/android/$eulaFileName.txt" -Path ("$tosAndroidPath\" + $eulaFiles[$eulaFileName] + ".txt") -Force
}