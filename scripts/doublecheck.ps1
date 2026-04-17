$root = "D:\proyectos\MODULOS"

$requiredFiles = @(
  "$root\README.md",
  "$root\STATUS.md",
  "$root\REPORTE_FINAL.md",
  "$root\GUIA_DE_USO.md",
  "$root\MANIFIESTO.md",
  "$root\STACKS_DISPONIBLES.md",
  "$root\package.json",
  "$root\tsconfig.json",
  "$root\viewer\index.html",
  "$root\viewer\app.js",
  "$root\viewer\styles.css",
  "$root\catalogo\README.md",
  "$root\comparativos\modulos-equivalentes.md",
  "$root\comparativos\modulos-semilla.md",
  "$root\comparativos\fases-de-extraccion.md",
  "$root\blueprints\blueprint-restaurante.md",
  "$root\blueprints\blueprint-real-estate-operativo.md",
  "$root\blueprints\blueprint-rrhh-documental.md",
  "$root\blueprints\blueprint-loyalty-wallet.md",
  "$root\casos\rishtedar.md",
  "$root\casos\CorredoresPro.md",
  "$root\casos\pluscontable.cl.md",
  "$root\casos\fidelizacion.md",
  "$root\casos\superpanel3.0.md",
  "$root\casos\agendaproyectos.md",
  "$root\registry\modulos-registry.json",
  "$root\modulos\README.md",
  "$root\scripts\resolve-stack.ps1",
  "$root\scripts\serve-viewer.mjs",
  "$root\tests\mercadopago-core.test.mjs",
  "$root\tests\tenant-config-core.test.mjs",
  "$root\tests\booking-locks.test.mjs",
  "$root\tests\food-engine-core.test.mjs",
  "$root\tests\b2b-store-engine.test.mjs",
  "$root\tests\booking-rubro-config-core.test.mjs",
  "$root\tests\lead-hunting-core.test.mjs",
  "$root\tests\snapshot-toolkit.test.mjs",
  "$root\tests\route-compliance-core.test.mjs",
  "$root\tests\payment-grouping-core.test.mjs",
  "$root\tests\tenant-limits-core.test.mjs",
  "$root\tests\download-token-core.test.mjs",
  "$root\tests\whatsapp-template-kit.test.mjs",
  "$root\tests\subscription-alerts-core.test.mjs",
  "$root\tests\dispatch-ranking-core.test.mjs",
  "$root\tests\loyalty-ledger-core.test.mjs",
  "$root\tests\tenant-shell-core.test.mjs",
  "$root\tests\scraper-engine-core.test.mjs",
  "$root\tests\landing-factory-core.test.mjs",
  "$root\tests\promotions-banner-engine.test.mjs",
  "$root\tests\food-saturation-core.test.mjs",
  "$root\tests\email-parsing-core.test.mjs",
  "$root\tests\credentials-encryption-core.test.mjs",
  "$root\tests\payment-gateway-router-core.test.mjs",
  "$root\tests\cart-pricing-core.test.mjs",
  "$root\tests\outreach-message-core.test.mjs",
  "$root\tests\push-notification-sw-core.test.mjs",
  "$root\tests\tenant-host-routing-core.test.mjs",
  "$root\tests\zeleri-signature-core.test.mjs",
  "$root\tests\zeleri-oneshot-core.test.mjs",
  "$root\tests\food-ops-notification-core.test.mjs",
  "$root\tests\table-service-core.test.mjs",
  "$root\tests\ticket-format-core.test.mjs",
  "$root\tests\driver-subscription-core.test.mjs",
  "$root\tests\toll-pricing-core.test.mjs",
  "$root\tests\payment-allocation-core.test.mjs",
  "$root\tests\cash-close-alerts-core.test.mjs",
  "$root\tests\wallet-message-core.test.mjs",
  "$root\tests\hospitality-email-core.test.mjs",
  "$root\tests\pod-certificate-core.test.mjs",
  "$root\tests\order-update-message-core.test.mjs",
  "$root\tests\order-update-email-core.test.mjs",
  "$root\tests\worker-registration-link-core.test.mjs",
  "$root\tests\report-dataset-core.test.mjs",
  "$root\tests\rental-contract-outline-core.test.mjs",
  "$root\tests\route-planning-core.test.mjs",
  "$root\tests\arrears-alert-core.test.mjs",
  "$root\tests\employment-contract-outline-core.test.mjs",
  "$root\tests\worker-event-compensation-core.test.mjs",
  "$root\tests\territorial-report-outline-core.test.mjs",
  "$root\tests\map-surface-core.test.mjs",
  "$root\tests\dashboard-alerts-core.test.mjs",
  "$root\tests\service-quote-outline-core.test.mjs",
  "$root\tests\honorarios-account-outline-core.test.mjs",
  "$root\tests\social-security-report-outline-core.test.mjs",
  "$root\tests\google-wallet-pass-core.test.mjs",
  "$root\tests\program-motor-config-core.test.mjs",
  "$root\tests\flow-subscription-core.test.mjs",
  "$root\tests\billing-plan-catalog-core.test.mjs",
  "$root\tests\advisor-insights-core.test.mjs",
  "$root\tests\rate-limit-core.test.mjs",
  "$root\tests\expiration-window-core.test.mjs",
  "$root\tests\currency-format-core.test.mjs",
  "$root\tests\weighted-cost-core.test.mjs",
  "$root\tests\notification-preferences-core.test.mjs",
  "$root\tests\monthly-credit-reset-core.test.mjs",
  "$root\tests\project-workspace-core.test.mjs",
  "$root\tests\project-accounting-core.test.mjs",
  "$root\tests\project-credentials-vault-core.test.mjs",
  "$root\tests\demo-tracking-core.test.mjs",
  "$root\tests\growth-plan-core.test.mjs",
  "$root\tests\report-pipeline-core.test.mjs",
  "$root\tests\chilean-utils-core.test.mjs",
  "$root\tests\sales-agent-core.test.mjs",
  "$root\modulos\delivery\order-state-machine\src\index.ts",
  "$root\modulos\delivery\pricing-core\src\index.ts",
  "$root\modulos\delivery\tracking-core\src.ts",
  "$root\modulos\delivery\route-compliance-core\src.ts",
  "$root\modulos\delivery\dispatch-ranking-core\src.ts",
  "$root\modulos\delivery\toll-pricing-core\src.ts",
  "$root\modulos\pos\product-importer\src\index.ts",
  "$root\modulos\pos\table-service-core\src.ts",
  "$root\modulos\pos\ticket-format-core\src.ts",
  "$root\modulos\payments\mercadopago-core\src.ts",
  "$root\modulos\payments\payment-grouping-core\src.ts",
  "$root\modulos\payments\payment-allocation-core\src.ts",
  "$root\modulos\payments\zeleri-signature-core\src.ts",
  "$root\modulos\payments\zeleri-oneshot-core\src.ts",
  "$root\modulos\payments\flow-subscription-core\src.ts",
  "$root\modulos\tenancy\tenant-config-core\src.ts",
  "$root\modulos\tenancy\tenant-limits-core\src.ts",
  "$root\modulos\tenancy\billing-plan-catalog-core\src.ts",
  "$root\modulos\tenancy\tenant-shell-core\src.ts",
  "$root\modulos\tenancy\tenant-host-routing-core\src.ts",
  "$root\modulos\booking\booking-locks\src.ts",
  "$root\modulos\booking\agenda-core\src.ts",
  "$root\modulos\booking\booking-rubro-config-core\src.ts",
  "$root\modulos\pdf\tenant-branded-documents\src.ts",
  "$root\modulos\pdf\pod-certificate-core\src.ts",
  "$root\modulos\pdf\rental-contract-outline-core\src.ts",
  "$root\modulos\pdf\employment-contract-outline-core\src.ts",
  "$root\modulos\pdf\territorial-report-outline-core\src.ts",
  "$root\modulos\pdf\service-quote-outline-core\src.ts",
  "$root\modulos\pdf\honorarios-account-outline-core\src.ts",
  "$root\modulos\pdf\social-security-report-outline-core\src.ts",
  "$root\modulos\access\download-token-core\src.ts",
  "$root\modulos\access\credentials-encryption-core\src.ts",
  "$root\modulos\access\project-credentials-vault-core\src.ts",
  "$root\modulos\access\worker-registration-link-core\src.ts",
  "$root\modulos\crm\support-inbox-core\src\index.ts",
  "$root\modulos\crm\email-parsing-core\src.ts",
  "$root\modulos\crm\outreach-message-core\src.ts",
  "$root\modulos\crm\pipeline-board\src.ts",
  "$root\modulos\crm\lead-hunting-core\src.ts",
  "$root\modulos\crm\advisor-insights-core\src.ts",
  "$root\modulos\crm\loyalty-ledger-core\src.ts",
  "$root\modulos\crm\demo-tracking-core\src.ts",
  "$root\modulos\crm\growth-plan-core\src.ts",
  "$root\modulos\crm\sales-agent-core\src.ts",
  "$root\modulos\notifications\dispatch-kit\src\index.ts",
  "$root\modulos\notifications\dashboard-alerts-core\src.ts",
  "$root\modulos\notifications\driver-subscription-core\src.ts",
  "$root\modulos\notifications\order-update-message-core\src.ts",
  "$root\modulos\notifications\order-update-email-core\src.ts",
  "$root\modulos\notifications\whatsapp-template-kit\src.ts",
  "$root\modulos\notifications\notification-preferences-core\src.ts",
  "$root\modulos\notifications\push-notification-sw-core\src.ts",
  "$root\modulos\notifications\wallet-message-core\src.ts",
  "$root\modulos\notifications\hospitality-email-core\src.ts",
  "$root\modulos\food\food-engine-core\src.ts",
  "$root\modulos\commerce\b2b-store-engine\src.ts",
  "$root\modulos\commerce\cart-pricing-core\src.ts",
  "$root\modulos\commerce\program-motor-config-core\src.ts",
  "$root\modulos\intelligence\scraper-engine-core\src.ts",
  "$root\modulos\intelligence\food-saturation-core\src.ts",
  "$root\modulos\factory\landing-factory-core\src.ts",
  "$root\modulos\portals\role-based-portals\src.ts",
  "$root\modulos\geo\territorial-intelligence\src.ts",
  "$root\modulos\geo\route-planning-core\src.ts",
  "$root\modulos\geo\map-surface-core\src.ts",
  "$root\modulos\cms\editable-content-core\src.ts",
  "$root\modulos\cms\promotions-banner-engine\src.ts",
  "$root\modulos\integrations\property-publisher-core\src.ts",
  "$root\modulos\integrations\google-wallet-pass-core\src.ts",
  "$root\modulos\payments\payment-gateway-router-core\src.ts",
  "$root\modulos\ops\snapshot-toolkit\src.ts",
  "$root\modulos\ops\monthly-credit-reset-core\src.ts",
  "$root\modulos\ops\rate-limit-core\src.ts",
  "$root\modulos\ops\expiration-window-core\src.ts",
  "$root\modulos\ops\weighted-cost-core\src.ts",
  "$root\modulos\ops\chilean-utils-core\src.ts",
  "$root\modulos\ops\project-workspace-core\src.ts",
  "$root\modulos\ops\project-accounting-core\src.ts",
  "$root\modulos\ops\cash-close-alerts-core\src.ts",
  "$root\modulos\ops\food-ops-notification-core\src.ts",
  "$root\modulos\ops\subscription-alerts-core\src.ts",
  "$root\modulos\ops\report-dataset-core\src.ts",
  "$root\modulos\ops\report-pipeline-core\src.ts",
  "$root\modulos\ops\arrears-alert-core\src.ts",
  "$root\modulos\ops\worker-event-compensation-core\src.ts"
)

$missing = @()
foreach ($file in $requiredFiles) {
  if (-not (Test-Path $file)) {
    $missing += $file
  }
}

$moduleSources = Get-ChildItem "$root\modulos" -Recurse -File | Where-Object { $_.Extension -in ".ts", ".md" }
$emptyFiles = $moduleSources | Where-Object { $_.Length -eq 0 } | Select-Object -ExpandProperty FullName
$registryPath = "$root\registry\modulos-registry.json"
$registry = Get-Content -Path $registryPath -Raw | ConvertFrom-Json

$usageMismatches = @()
foreach ($module in $registry.modules) {
  $actualCases = @(
    $registry.cases |
      Where-Object { $_.modules -contains $module.id } |
      ForEach-Object { $_.id } |
      Sort-Object -Unique
  )
  $declaredCases = @($module.used_in_cases | Sort-Object -Unique)

  $actualBlueprints = @(
    $registry.blueprints |
      Where-Object { $_.recommended_modules -contains $module.id } |
      ForEach-Object { $_.id } |
      Sort-Object -Unique
  )
  $declaredBlueprints = @($module.used_in_blueprints | Sort-Object -Unique)

  $casesMatch = (@($actualCases) -join "|") -eq (@($declaredCases) -join "|")
  $blueprintsMatch = (@($actualBlueprints) -join "|") -eq (@($declaredBlueprints) -join "|")

  if (-not $casesMatch -or -not $blueprintsMatch -or [string]::IsNullOrWhiteSpace($module.status) -or [string]::IsNullOrWhiteSpace($module.category)) {
    $usageMismatches += [PSCustomObject]@{
      id = $module.id
      actual_cases = $actualCases
      declared_cases = $declaredCases
      actual_blueprints = $actualBlueprints
      declared_blueprints = $declaredBlueprints
      status = $module.status
      category = $module.category
    }
  }
}

$legacyRegistryFields = @(
  Select-String -Path $registryPath -Pattern '"maturity"|"taxonomy"'
)

$catalogadoStatuses = @(
  $registry.modules | Where-Object { $_.status -eq "catalogado" }
)

$referenceFinalStatuses = @(
  $registry.modules | Where-Object { $_.status -eq "referencia final" }
)

$report = [PSCustomObject]@{
  checked_at = (Get-Date).ToString("s")
  required_count = $requiredFiles.Count
  missing_count = $missing.Count
  empty_count = @($emptyFiles).Count
  module_file_count = @($moduleSources).Count
  registry_module_count = @($registry.modules).Count
  registry_hardened_count = @($registry.modules | Where-Object { $_.status -match "endurecido" }).Count
  registry_reference_final_count = $referenceFinalStatuses.Count
  registry_usage_mismatch_count = $usageMismatches.Count
  registry_legacy_field_count = $legacyRegistryFields.Count
  registry_catalogado_count = $catalogadoStatuses.Count
}

$report | ConvertTo-Json -Depth 4

if ($missing.Count -gt 0) {
  Write-Host "Missing files:"
  $missing | ForEach-Object { Write-Host $_ }
}

if (@($emptyFiles).Count -gt 0) {
  Write-Host "Empty files:"
  $emptyFiles | ForEach-Object { Write-Host $_ }
}

if ($usageMismatches.Count -gt 0) {
  Write-Host "Registry mismatches:"
  $usageMismatches | ForEach-Object { $_ | ConvertTo-Json -Depth 6 | Write-Host }
}

if ($legacyRegistryFields.Count -gt 0) {
  Write-Host "Legacy registry fields still present:"
  $legacyRegistryFields | ForEach-Object { Write-Host $_.Line }
}

if ($catalogadoStatuses.Count -gt 0) {
  Write-Host "Legacy catalogado statuses still present:"
  $catalogadoStatuses | ForEach-Object { Write-Host $_.id }
}

if ($missing.Count -gt 0 -or @($emptyFiles).Count -gt 0 -or $usageMismatches.Count -gt 0 -or $legacyRegistryFields.Count -gt 0 -or $catalogadoStatuses.Count -gt 0) {
  exit 1
}
