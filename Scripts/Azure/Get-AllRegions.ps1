$singleRegion = $args[0]

$null = .{

	$regions = @{
		"use" = "East US";
		"uss" = "South Central US";
		"eun" = "North Europe";
		"euw" = "West Europe";
	}

	$regionsToRemove = New-Object System.Collections.ArrayList

	if ($singleRegion -ne $null) {
		foreach ($region in $regions.Keys) {
			if ($region -ne $singleRegion) {
				$regionsToRemove.Add($region)
			}
		}

		foreach ($region in $regionsToRemove) {
			$regions.Remove($region)
		}
	}

}

$regions