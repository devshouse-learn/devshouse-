# Script para configurar GitHub Secrets
# Ejecutar despues de instalar GitHub CLI

Write-Host "Configurando GitHub Secrets..." -ForegroundColor Cyan
Write-Host ""

# Obtener credenciales de AWS
$AWS_ACCESS_KEY = aws configure get aws_access_key_id
$AWS_SECRET_KEY = aws configure get aws_secret_access_key

# Valores fijos
$AWS_REGION = "us-east-1"
$S3_BUCKET = "devshouse-frontend-2025"
$EB_APP = "devshouse-backend"
$EB_ENV = "devshouse-prod"

Write-Host "Configurando secrets en GitHub..." -ForegroundColor Yellow
Write-Host ""

# Configurar secrets usando GitHub CLI
echo $AWS_ACCESS_KEY | gh secret set AWS_ACCESS_KEY_ID
echo $AWS_SECRET_KEY | gh secret set AWS_SECRET_ACCESS_KEY
echo $AWS_REGION | gh secret set AWS_REGION
echo $S3_BUCKET | gh secret set S3_BUCKET_NAME
echo $EB_APP | gh secret set EB_APPLICATION_NAME
echo $EB_ENV | gh secret set EB_ENVIRONMENT_NAME

Write-Host "[OK] 6 secrets configurados!" -ForegroundColor Green
Write-Host ""
Write-Host "Falta configurar VITE_API_URL" -ForegroundColor Yellow
Write-Host "Ejecuta este comando cuando el ambiente este listo:" -ForegroundColor Cyan
Write-Host ""
Write-Host "aws elasticbeanstalk describe-environments --application-name devshouse-backend --environment-names devshouse-prod --query 'Environments[0].CNAME' --output text | ForEach-Object { `"http://`$_`" | gh secret set VITE_API_URL }" -ForegroundColor White
Write-Host ""
