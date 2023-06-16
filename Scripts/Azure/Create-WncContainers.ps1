#Copyright © 2019 Xerox Corporation. All Rights Reserved.
param(
	[String]$env = "prod", 
	[String]$subscription = "XAS Production",
	[String]$tenantId,
	[String]$applicationId,
	[String]$servicePrincipalKeyPlainText,
	[String]$tag,
	[String]$scriptDir,
	[String]$singleRegion = $null
)

$servicePrincipalKey = ConvertTo-SecureString $servicePrincipalKeyPlainText -AsPlainText -Force
$workingDir = Get-Location
$scriptPath = "$scriptDir/_Written Note Conversion/Xerox.Wnc/Scripts/Azure"
$envSuffix = (& "$scriptPath/Get-EnvSuffix.ps1" $env)

& "$scriptPath\ConnectTo-Azure.ps1" -Subscription $subscription -TenantId $tenantId -ApplicationId $applicationId -ServicePrincipalKey $servicePrincipalKey

$containers = @{
	"xerox-wnc-web"    = @{ "csproj" = "../../../Xerox.Wnc/Xerox.Wnc.Web/Xerox.Wnc.Web.csproj"      ; "AppInsightsName" = "xerox-wnc$envSuffix-ai" };
	#"xerox-wnc-portal" = @{ "csproj" = "../../../Xerox.Wnc/Xerox.Wnc.Portal/Xerox.Wnc.Portal.csproj"; "AppInsightsName" = "xerox-wnc$envSuffix-ai" };
}

foreach ($containerKey in $containers.Keys) 
{
	$csproj = $containers[$containerKey]["csproj"]
	$appInsightsName = $containers[$containerKey]["AppInsightsName"]

	Start-Job -FilePath "$scriptPath/Create-Container.ps1" -ArgumentList $env, $subscription, $tenantId, $applicationId, $servicePrincipalKeyPlainText, $workingDir, $containerKey, $containerKey, $appInsightsName, $tag, $scriptDir, $singleRegion
}

Start-Sleep 10

while ($true) {
    Start-Sleep 2
	Get-Job | Receive-Job

	$continue = $false

	foreach ($containerKey in $containers.Keys) {
		if (Test-Path -Path "$containerKey.lock") {
			$continue = $true
			break
		}
	}

	if (!$continue) { break }
}