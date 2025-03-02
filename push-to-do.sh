#!/bin/bash

# Exit on error
set -e

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "doctl is not installed. Please install it first."
    exit 1
fi

# Check if we're authenticated with DigitalOcean
if ! doctl account get &> /dev/null; then
    echo "Not authenticated with DigitalOcean. Please run 'doctl auth init' first."
    exit 1
fi

# Get registry name from argument or use default
REGISTRY_NAME=${1:-"todo-app-registry"}

# Create registry if it doesn't exist
if ! doctl registry get > /dev/null 2>&1; then
    echo "Creating DigitalOcean container registry..."
    doctl registry create --subscription-tier basic $REGISTRY_NAME
fi

# Get registry endpoint
REGISTRY_ENDPOINT=$(doctl registry get --format Endpoint --no-header)

# Build the Spring Boot application
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

# Login to registry
echo "Logging into DigitalOcean container registry..."
doctl registry login

# Build and push backend
echo "Building and pushing backend image..."
docker build -t ${REGISTRY_ENDPOINT}/todo-app-backend:latest .
docker push ${REGISTRY_ENDPOINT}/todo-app-backend:latest

# Build and push frontend
echo "Building and pushing frontend image..."
cd frontend
docker build -t ${REGISTRY_ENDPOINT}/todo-app-frontend:latest .
docker push ${REGISTRY_ENDPOINT}/todo-app-frontend:latest

echo "Images have been successfully pushed to DigitalOcean registry!"
echo "You can now deploy them using the DigitalOcean App Platform."