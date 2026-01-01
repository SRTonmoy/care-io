#!/bin/bash

# CARE-IO MongoDB Deployment Script
set -e

echo "🚀 Starting CARE-IO MongoDB deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found!${NC}"
    exit 1
fi

# Load production environment variables
set -a
source .env.production
set +a

echo -e "${YELLOW}Step 1: Running tests...${NC}"
npm run test || {
    echo -e "${RED}Tests failed! Aborting deployment.${NC}"
    exit 1
}

echo -e "${YELLOW}Step 2: Building application...${NC}"
npm run build

echo -e "${YELLOW}Step 3: Seeding database...${NC}"
node scripts/seed-mongo.js || {
    echo -e "${RED}Database seeding failed!${NC}"
    exit 1
}

echo -e "${YELLOW}Step 4: Starting application...${NC}"

# Check deployment platform
if [ "$DEPLOY_PLATFORM" = "vercel" ]; then
    echo "Deploying to Vercel..."
    vercel --prod --confirm
elif [ "$DEPLOY_PLATFORM" = "railway" ]; then
    echo "Deploying to Railway..."
    railway up
elif [ "$DEPLOY_PLATFORM" = "render" ]; then
    echo "Deploying to Render..."
    # Render specific deployment steps
elif [ "$DEPLOY_PLATFORM" = "docker" ]; then
    echo "Building and deploying Docker container..."
    docker-compose up -d --build
elif [ "$DEPLOY_PLATFORM" = "mongo-atlas" ]; then
    echo "Deploying with MongoDB Atlas..."
    # MongoDB Atlas specific steps
else
    echo -e "${GREEN}Deployment completed locally.${NC}"
    echo -e "${YELLOW}To start the application:${NC}"
    echo "  npm start"
    echo -e "${YELLOW}To start with Docker:${NC}"
    echo "  docker-compose up -d"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "\nApplication URL: ${NEXT_PUBLIC_APP_URL}"