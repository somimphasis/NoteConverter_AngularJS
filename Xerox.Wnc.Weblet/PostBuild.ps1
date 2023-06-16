$app    = "XeroxNoteConverter"
$label  = "Xerox Note Converter"
$domain = "wnc-web"
$apiDomain = "wncservice"
$suffix = "services.xerox.com"

function Remove-IfExists {
	param( [string]$filename )
	if (Test-Path $filename) { Remove-Item -path $filename -force -recurse }
}

function Create-TempFolder {
	param( [string]$forEnvironment )
	Copy-Item -path ../${app} -recurse -destination ../${app}-${forEnvironment}
}

function Update-AppLabel {
	param( [string]$forEnvironment )

	$filename = "description.xml"
	$folderName = "${app}-${forEnvironment}"
	$filePath = "${folderName}/${filename}"

	(Get-Content ../${filePath}) | ForEach-Object { $_ -replace "<label>${label}</label>", "<label>${label} - ${forEnvironment}</label>" } | Set-Content ../${filePath}
}

function Update-RedirectURL {
	param( [string]$forEnvironment, [string]$domainSuffix )

	$filename = "apps_common.js"
	$folderName = "${app}-${forEnvironment}/Scripts"
	$filePath = "${folderName}/${filename}"
	$originalUrl = "'https://${domain}.${suffix}'"
	$environmentUrl = "'https://${domain}-${domainSuffix}.${suffix}'"

	(Get-Content ../${filePath}) | ForEach-Object { $_ -replace ${originalUrl}, ${environmentUrl} } | Set-Content ../${filePath}

	$originalUrl = "'https://${apiDomain}.${suffix}'"
	$environmentUrl = "'https://${apiDomain}-${domainSuffix}.${suffix}'"
	(Get-Content ../${filePath}) | ForEach-Object { $_ -replace ${originalUrl}, ${environmentUrl} } | Set-Content ../${filePath}
}

function Rename-WebletFile {
	param( [string]$forEnvironment, [string]$extension)

	$originalFilename = "${app}.${extension}"
	$newFilename = "${app}-${forEnvironment}.${extension}"
	$folderName = "${app}-${forEnvironment}"
	$originalFilePath = "${folderName}/${originalFilename}"

	Rename-Item -path ../${originalFilePath} -newname ${newFilename} -force
}

function Create-ZipFile {
	param( [string]$forEnvironment )

	$folderName = "${app}"
	$zipFileName = "${app}.zip"

	if (-NOT (${forEnvironment} -eq '')) { $folderName = "${app}-${forEnvironment}" }
	if (-NOT (${forEnvironment} -eq '')) { $zipFileName = "${app}-${forEnvironment}.zip" }

	Compress-Archive -path ../${folderName} -DestinationPath ../${zipFileName}
}

function Remove-DefaultArtifacts {
	Remove-IfExists ./Microsoft.CodeDom.Providers.DotNetCompilerPlatform.dll
	Remove-IfExists ./Microsoft.CodeDom.Providers.DotNetCompilerPlatform.xml

	Remove-IfExists ./*.dll       
	Remove-IfExists ./*.exe       
	Remove-IfExists ./*.pdb       
	Remove-IfExists ./*.dll.config
	Remove-IfExists ./*.exe.config
}

function Remove-PreviousZipFiles {
	Remove-IfExists ../${app}.zip      
	Remove-IfExists ../${app}-Dev.zip  
	Remove-IfExists ../${app}-Test.zip 
	Remove-IfExists ../${app}-Stage.zip
}

function Remove-PreviousTempFolders {
	Remove-IfExists ../${app}-Dev  
	Remove-IfExists ../${app}-Test 
	Remove-IfExists ../${app}-Stage
}

function Create-TempFolders {
	Create-TempFolder Dev
	Create-TempFolder Test
	Create-TempFolder Stage
}

function Update-AppLabels {
	Update-AppLabel Dev
	Update-AppLabel Test
	Update-AppLabel Stage
}

function Update-RedirectURLs {
	Update-RedirectURL Dev dev
	Update-RedirectURL Test test
	Update-RedirectURL Stage  stage
}


function Rename-KnownWebletFiles {
	Rename-WebletFile Dev html
	Rename-WebletFile Test html
	Rename-WebletFile Stage html

	Rename-WebletFile Dev png
	Rename-WebletFile Test png
	Rename-WebletFile Stage png
}

function Create-ZipFiles {
	Create-ZipFile ''
	Create-ZipFile Dev
	Create-ZipFile Test
	Create-ZipFile Stage
}


Remove-DefaultArtifacts
Remove-PreviousZipFiles
Remove-PreviousTempFolders
Create-TempFolders
Update-AppLabels
Update-RedirectURLs
Rename-KnownWebletFiles
Create-ZipFiles