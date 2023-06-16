$singleRegion = $args[0]

$null = .{

	$regions = @{
		"us" = "East US";
		"eu" = "North Europe";
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