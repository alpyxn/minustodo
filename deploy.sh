#!/bin/bash

# Exit on error
set -e

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if we're logged in to AWS
aws sts get-caller-identity &> /dev/null || {
    echo "Not logged in to AWS. Please run 'aws configure' first."
    exit 1
}

# Set database password
DB_PASSWORD="TodoApp2024!Secure"

# Build the Spring Boot application
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

# Build and push Docker images
echo "Building and pushing Docker images..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

# Create ECR repositories if they don't exist
aws ecr describe-repositories --repository-names todo-app-backend --region $AWS_REGION || \
    aws ecr create-repository --repository-name todo-app-backend --region $AWS_REGION
aws ecr describe-repositories --repository-names todo-app-frontend --region $AWS_REGION || \
    aws ecr create-repository --repository-name todo-app-frontend --region $AWS_REGION

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend
docker build -t todo-app-backend .
docker tag todo-app-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-app-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-app-backend:latest

# Build and push frontend
cd frontend
docker build -t todo-app-frontend .
docker tag todo-app-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-app-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-app-frontend:latest
cd ..

# Deploy CloudFormation stacks
echo "Deploying CloudFormation stacks..."

# Deploy network stack
aws cloudformation deploy \
    --template-file infrastructure/network.yaml \
    --stack-name todo-app-network \
    --capabilities CAPABILITY_IAM

# Deploy RDS stack
aws cloudformation deploy \
    --template-file infrastructure/rds.yaml \
    --stack-name todo-app-rds \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    DBUsername=admin \
    DBPassword=$DB_PASSWORD

# Get the hosted zone ID for your domain
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "alperrasimgursoy.xyz" --query "HostedZones[0].Id" --output text | cut -d'/' -f3)

# Deploy ECS stack
aws cloudformation deploy \
    --template-file infrastructure/ecs.yaml \
    --stack-name todo-app-ecs \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    DomainName=alperrasimgursoy.xyz \
    ExistingHostedZoneId=$HOSTED_ZONE_ID

# Deploy Route53 and ECS service stack
aws cloudformation deploy \
    --template-file infrastructure/route53-service.yaml \
    --stack-name todo-app-service \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    DomainName=alperrasimgursoy.xyz \
    ExistingHostedZoneId=$HOSTED_ZONE_ID \
    ContainerImage=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/todo-app-backend:latest

echo "Deployment completed successfully!"