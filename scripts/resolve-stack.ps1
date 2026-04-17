param(
  [string]$Blueprint,
  [string[]]$Capability,
  [switch]$IncludeModules,
  [switch]$IncludeCases
)

$root = "D:\proyectos\MODULOS"
$registryPath = Join-Path $root "registry\modulos-registry.json"

if (-not (Test-Path $registryPath)) {
  throw "Registry no encontrado en $registryPath"
}

$registry = Get-Content -Path $registryPath -Raw | ConvertFrom-Json

function New-SelectionResult {
  param(
    [string]$SelectedBlueprint,
    [object[]]$Blueprints,
    [object[]]$Cases,
    [object[]]$Modules
  )

  [PSCustomObject]@{
    selected_blueprint = $SelectedBlueprint
    blueprints = $Blueprints
    cases = $Cases
    modules = $Modules
  }
}

if ($Blueprint) {
  $selectedBlueprint = $registry.blueprints | Where-Object { $_.id -eq $Blueprint }

  if (-not $selectedBlueprint) {
    throw "Blueprint '$Blueprint' no existe en el registry."
  }

  $moduleItems = @()
  if ($IncludeModules) {
    $moduleItems = $registry.modules | Where-Object { $selectedBlueprint.recommended_modules -contains $_.id }
  }

  $caseItems = @()
  if ($IncludeCases) {
    $caseItems = $registry.cases | Where-Object { $selectedBlueprint.reference_cases -contains $_.id }
  }

  New-SelectionResult -SelectedBlueprint $selectedBlueprint.id -Blueprints @($selectedBlueprint) -Cases $caseItems -Modules $moduleItems |
    ConvertTo-Json -Depth 6
  return
}

if ($Capability -and $Capability.Count -gt 0) {
  $requested = @(
    $Capability |
      ForEach-Object { $_ -split "," } |
      ForEach-Object { $_.Trim() } |
      Where-Object { $_ } |
      ForEach-Object { $_.ToLowerInvariant() }
  )

  $matchingBlueprints = @(
    $registry.blueprints | Where-Object {
      $blueprintCapabilities = @($_.capabilities | ForEach-Object { $_.ToLowerInvariant() })
      ($requested | Where-Object { $blueprintCapabilities -contains $_ }).Count -gt 0
    }
  )

  $matchingCases = @(
    $registry.cases | Where-Object {
      $caseTags = @($_.tags | ForEach-Object { $_.ToLowerInvariant() })
      ($requested | Where-Object { $caseTags -contains $_ }).Count -gt 0
    }
  )

  $directMatchingModules = @(
    $registry.modules | Where-Object {
      $moduleCapabilities = @($_.capabilities | ForEach-Object { $_.ToLowerInvariant() })
      ($requested | Where-Object { $moduleCapabilities -contains $_ }).Count -gt 0
    }
  )

  $recommendedIds = @(
    $matchingBlueprints |
      ForEach-Object { $_.recommended_modules } |
      Sort-Object -Unique
  )

  $blueprintRecommendedModules = @(
    $registry.modules | Where-Object { $recommendedIds -contains $_.id }
  )

  $matchingModules = @(
    $directMatchingModules + $blueprintRecommendedModules |
      Sort-Object id -Unique
  )

  New-SelectionResult -SelectedBlueprint "" -Blueprints $matchingBlueprints -Cases $matchingCases -Modules $matchingModules |
    ConvertTo-Json -Depth 6
  return
}

@"
Uso:
  powershell -ExecutionPolicy Bypass -File D:\proyectos\MODULOS\scripts\resolve-stack.ps1 -Blueprint restaurante -IncludeModules -IncludeCases
  powershell -ExecutionPolicy Bypass -File D:\proyectos\MODULOS\scripts\resolve-stack.ps1 -Capability delivery,pagos -IncludeModules -IncludeCases
"@
