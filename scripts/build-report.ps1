$root = "D:\proyectos\MODULOS\modulos"
$groups = Get-ChildItem $root -Directory | ForEach-Object {
  $namespace = $_.Name
  Get-ChildItem $_.FullName -Directory | ForEach-Object {
    $name = $_.Name
    $hasReadme = Test-Path (Join-Path $_.FullName "README.md")
    $hasContract = Test-Path (Join-Path $_.FullName "CONTRACT.md")
    $hasSource = @(Get-ChildItem $_.FullName -Recurse -File -Include *.ts).Count -gt 0

    [PSCustomObject]@{
      namespace = $namespace
      module = $name
      readme = $hasReadme
      contract = $hasContract
      source = $hasSource
    }
  }
}

$groups | Sort-Object namespace, module | Format-Table -AutoSize
