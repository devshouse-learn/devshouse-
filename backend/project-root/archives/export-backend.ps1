# Script para exportar backend manualmente para Elastic Beanstalk
# Uso: .\export-backend.ps1

Write-Host ""
Write-Host "EXPORTANDO BACKEND PARA ELASTIC BEANSTALK" -ForegroundColor Cyan
Write-Host ""

# Limpiar exports anteriores
if (Test-Path "backend-eb-export.zip") {
    Remove-Item "backend-eb-export.zip" -Force
    Write-Host "[OK] Limpiado export anterior" -ForegroundColor Green
}

# Cambiar a directorio backend
Set-Location backend

# Archivos y carpetas a incluir
$itemsToInclude = @(
    "src",
    ".ebextensions",
    ".platform",
    "package.json",
    "package-lock.json",
    "Procfile",
    ".ebignore"
)

# Verificar que existen
$missing = @()
foreach ($item in $itemsToInclude) {
    if (-not (Test-Path $item)) {
        $missing += $item
    }
}

if ($missing.Count -gt 0) {
    Write-Host "ADVERTENCIA - Archivos faltantes:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "Creando package sin node_modules..." -ForegroundColor Yellow

# Crear el ZIP
Compress-Archive -Path $itemsToInclude -DestinationPath "../backend-eb-export.zip" -Force -ErrorAction Stop

Set-Location ..

# Mostrar resultado
$size = (Get-Item "backend-eb-export.zip").Length
$sizeKB = [math]::Round($size / 1KB, 2)
$sizeMB = [math]::Round($size / 1MB, 2)

Write-Host ""
Write-Host "PACKAGE CREADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "   Archivo: backend-eb-export.zip" -ForegroundColor Cyan
Write-Host "   Tamano: $sizeKB KB" -ForegroundColor Cyan

Write-Host ""
Write-Host "CONTENIDO DEL PACKAGE:" -ForegroundColor Yellow
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("$PWD\backend-eb-export.zip")
$zip.Entries | Select-Object FullName | ForEach-Object { Write-Host "   $($_.FullName)" -ForegroundColor Gray }
$zip.Dispose()

Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Ve a la consola de AWS Elastic Beanstalk" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/elasticbeanstalk/" -ForegroundColor Gray
Write-Host "2. Selecciona tu aplicacion: devshouse-backend" -ForegroundColor White
Write-Host "3. Haz clic en Upload and deploy" -ForegroundColor White
Write-Host "4. Sube el archivo: backend-eb-export.zip" -ForegroundColor White
Write-Host "5. Label sugerido: manual-$(Get-Date -Format 'yyyyMMdd-HHmmss')" -ForegroundColor Gray
Write-Host "6. Haz clic en Deploy" -ForegroundColor White

Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - El package NO incluye node_modules (se instalaran en el servidor)" -ForegroundColor Gray
Write-Host "   - Elastic Beanstalk ejecutara npm install --production automaticamente" -ForegroundColor Gray
Write-Host "   - La base de datos PostgreSQL debe estar configurada en las variables de entorno" -ForegroundColor Gray
Write-Host ""
