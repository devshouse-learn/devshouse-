#!/bin/bash

# Script de configuración para despliegue en AWS
# Este script te ayuda a crear los recursos necesarios en AWS

set -e

echo "🚀 DevsHouse - Configuración de AWS"
echo "======================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está instalado${NC}"
    echo "Instala AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI encontrado${NC}"

# Verificar configuración de AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI no está configurado${NC}"
    echo "Ejecuta: aws configure"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configurado${NC}"
echo ""

# Obtener región
AWS_REGION=$(aws configure get region)
if [ -z "$AWS_REGION" ]; then
    AWS_REGION="us-east-1"
    echo -e "${YELLOW}⚠️  Usando región por defecto: $AWS_REGION${NC}"
fi

echo "📍 Región: $AWS_REGION"
echo ""

# Solicitar nombres de recursos
read -p "📦 Nombre del bucket S3 para frontend (ej: devshouse-frontend): " S3_BUCKET
read -p "🌐 Nombre de la aplicación EB (ej: devshouse-backend): " EB_APP
read -p "🏷️  Nombre del ambiente EB (ej: devshouse-backend-prod): " EB_ENV

echo ""
echo "========================================"
echo "Configuración a crear:"
echo "========================================"
echo "S3 Bucket: $S3_BUCKET"
echo "EB Application: $EB_APP"
echo "EB Environment: $EB_ENV"
echo "Región: $AWS_REGION"
echo ""

read -p "¿Continuar? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelado"
    exit 1
fi

echo ""
echo "🔧 Creando recursos..."
echo ""

# 1. Crear bucket S3
echo "📦 Creando bucket S3..."
if aws s3 mb s3://$S3_BUCKET --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}✅ Bucket S3 creado${NC}"
else
    echo -e "${YELLOW}⚠️  El bucket ya existe o no se pudo crear${NC}"
fi

# 2. Configurar website hosting en S3
echo "🌐 Configurando website hosting..."
aws s3 website s3://$S3_BUCKET --index-document index.html --error-document index.html

# 3. Crear política del bucket
echo "🔒 Configurando política del bucket..."
cat > /tmp/bucket-policy.json << EOF
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
EOF

aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file:///tmp/bucket-policy.json
echo -e "${GREEN}✅ Política del bucket configurada${NC}"

# 4. Crear aplicación Elastic Beanstalk
echo "📦 Creando aplicación Elastic Beanstalk..."
if aws elasticbeanstalk create-application \
    --application-name $EB_APP \
    --description "DevsHouse Backend API" \
    --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}✅ Aplicación EB creada${NC}"
else
    echo -e "${YELLOW}⚠️  La aplicación ya existe${NC}"
fi

# 5. Crear ambiente Elastic Beanstalk
echo "🌍 Creando ambiente Elastic Beanstalk (esto puede tardar varios minutos)..."
if aws elasticbeanstalk create-environment \
    --application-name $EB_APP \
    --environment-name $EB_ENV \
    --solution-stack-name "64bit Amazon Linux 2023 v6.1.0 running Node.js 18" \
    --option-settings \
        Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role \
        Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance \
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=production \
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=PORT,Value=8080 \
    --region $AWS_REGION 2>/dev/null; then
    echo -e "${GREEN}✅ Ambiente EB creado (aún se está inicializando)${NC}"
else
    echo -e "${YELLOW}⚠️  El ambiente ya existe o hubo un error${NC}"
fi

echo ""
echo "========================================"
echo "✅ Configuración completada"
echo "========================================"
echo ""
echo "📝 Guarda estos valores como secrets en GitHub:"
echo ""
echo "AWS_REGION=$AWS_REGION"
echo "S3_BUCKET_NAME=$S3_BUCKET"
echo "EB_APPLICATION_NAME=$EB_APP"
echo "EB_ENVIRONMENT_NAME=$EB_ENV"
echo ""
echo "Obtén tu URL del backend cuando el ambiente termine de inicializarse:"
echo "aws elasticbeanstalk describe-environments --application-name $EB_APP --environment-names $EB_ENV --query 'Environments[0].CNAME' --output text"
echo ""
echo "🌐 URL del frontend (S3):"
echo "http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
echo ""
echo "Para configurar GitHub Secrets:"
echo "gh secret set AWS_REGION --body \"$AWS_REGION\""
echo "gh secret set S3_BUCKET_NAME --body \"$S3_BUCKET\""
echo "gh secret set EB_APPLICATION_NAME --body \"$EB_APP\""
echo "gh secret set EB_ENVIRONMENT_NAME --body \"$EB_ENV\""
echo ""
