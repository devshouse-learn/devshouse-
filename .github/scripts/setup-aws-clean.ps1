# Script de configuracion para despliegue en AWS (PowerShell)
# Este script te ayuda a crear los recursos necesarios en AWS

Write-Host "DevsHouse - Configuracion de AWS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar AWS CLI
try {
    aws --version | Out-Null
    Write-Host "[OK] AWS CLI encontrado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] AWS CLI no esta instalado" -ForegroundColor Red
    Write-Host "Instala AWS CLI: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Verificar configuracion de AWS
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "[OK] AWS CLI configurado" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] AWS CLI no esta configurado" -ForegroundColor Red
    Write-Host "Ejecuta: aws configure" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Obtener region
$AWS_REGION = aws configure get region
if ([string]::IsNullOrEmpty($AWS_REGION)) {
    $AWS_REGION = "us-east-1"
    Write-Host "[INFO] Usando region por defecto: $AWS_REGION" -ForegroundColor Yellow
}

Write-Host "Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host ""

# Solicitar nombres de recursos
$S3_BUCKET = Read-Host "Nombre del bucket S3 para frontend (ej: devshouse-frontend)"
$EB_APP = Read-Host "Nombre de la aplicacion EB (ej: devshouse-backend)"
$EB_ENV = Read-Host "Nombre del ambiente EB (ej: devshouse-backend-prod)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuracion a crear:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "S3 Bucket: $S3_BUCKET"
Write-Host "EB Application: $EB_APP"
Write-Host "EB Environment: $EB_ENV"
Write-Host "Region: $AWS_REGION"
Write-Host ""

$confirm = Read-Host "Continuar? (y/n)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "Cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creando recursos..." -ForegroundColor Cyan
Write-Host ""

# 1. Crear bucket S3
Write-Host "Creando bucket S3..."
try {
    aws s3 mb "s3://$S3_BUCKET" --region $AWS_REGION 2>$null
    Write-Host "[OK] Bucket S3 creado" -ForegroundColor Green
} catch {
    Write-Host "[INFO] El bucket ya existe o no se pudo crear" -ForegroundColor Yellow
}

# 2. Configurar website hosting en S3
Write-Host "Configurando website hosting..."
aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html

# 3. Crear politica del bucket
Write-Host "Configurando politica del bucket..."
$policyJson = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$S3_BUCKET/*"
    }
  ]
}
"@

$policyFile = "$env:TEMP\bucket-policy.json"
$policyJson | Out-File -FilePath $policyFile -Encoding UTF8
aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file://$policyFile
Write-Host "[OK] Politica del bucket configurada" -ForegroundColor Green

# 4. Crear aplicacion Elastic Beanstalk
Write-Host "Creando aplicacion Elastic Beanstalk..."
try {
    aws elasticbeanstalk create-application `
        --application-name $EB_APP `
        --description "DevsHouse Backend API" `
        --region $AWS_REGION 2>$null
    Write-Host "[OK] Aplicacion EB creada" -ForegroundColor Green
} catch {
    Write-Host "[INFO] La aplicacion ya existe" -ForegroundColor Yellow
}

# 5. Crear ambiente Elastic Beanstalk
Write-Host "Creando ambiente Elastic Beanstalk (esto puede tardar varios minutos)..."
try {
    aws elasticbeanstalk create-environment `
        --application-name $EB_APP `
        --environment-name $EB_ENV `
        --solution-stack-name "64bit Amazon Linux 2023 v6.1.0 running Node.js 18" `
        --option-settings `
            "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role" `
            "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance" `
            "Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production" `
            "Namespace=aws:elasticbeanstalk:application:environment,OptionName=PORT,Value=8080" `
        --region $AWS_REGION 2>$null
    Write-Host "[OK] Ambiente EB creado (aun se esta inicializando)" -ForegroundColor Green
} catch {
    Write-Host "[INFO] El ambiente ya existe o hubo un error" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Configuracion completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Guarda estos valores como secrets en GitHub:" -ForegroundColor Yellow
Write-Host ""
Write-Host "AWS_REGION=$AWS_REGION"
Write-Host "S3_BUCKET_NAME=$S3_BUCKET"
Write-Host "EB_APPLICATION_NAME=$EB_APP"
Write-Host "EB_ENVIRONMENT_NAME=$EB_ENV"
Write-Host ""
Write-Host "Obten tu URL del backend cuando el ambiente termine de inicializarse:"
Write-Host "aws elasticbeanstalk describe-environments --application-name $EB_APP --environment-names $EB_ENV --query ""Environments[0].CNAME"" --output text" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL del frontend (S3):"
Write-Host "http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com" -ForegroundColor Green
Write-Host ""
Write-Host "Para configurar GitHub Secrets (si tienes GitHub CLI):" -ForegroundColor Yellow
Write-Host "gh secret set AWS_REGION --body `"$AWS_REGION`""
Write-Host "gh secret set S3_BUCKET_NAME --body `"$S3_BUCKET`""
Write-Host "gh secret set EB_APPLICATION_NAME --body `"$EB_APP`""
Write-Host "gh secret set EB_ENVIRONMENT_NAME --body `"$EB_ENV`""
Write-Host ""
