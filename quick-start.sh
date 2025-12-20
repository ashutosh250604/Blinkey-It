#!/bin/bash

# Blinkey It - Quick Start Script
# This script helps you get started quickly with the project

echo "🚀 Blinkey It - Quick Start Setup"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"

# Check if MongoDB is installed or available
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found locally. You'll need MongoDB running or use MongoDB Atlas.${NC}"
else
    echo -e "${GREEN}✓ MongoDB CLI found${NC}"
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"

# Install server dependencies
echo -e "${BLUE}Installing server dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install server dependencies${NC}"
    exit 1
fi

# Install client dependencies
echo ""
echo -e "${BLUE}Installing client dependencies...${NC}"
cd ../client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install client dependencies${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${BLUE}Setting up environment files...${NC}"

# Create .env files if they don't exist
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo -e "${GREEN}✓ Created server/.env from template${NC}"
    echo -e "${YELLOW}⚠️  Please edit server/.env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  server/.env already exists${NC}"
fi

if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo -e "${GREEN}✓ Created client/.env from template${NC}"
    echo -e "${YELLOW}⚠️  Please edit client/.env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  client/.env already exists${NC}"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Configure your environment variables:"
echo "   - Edit server/.env with your MongoDB URI, JWT secrets, etc."
echo "   - Edit client/.env with your API URL"
echo ""
echo "2. Start the development servers:"
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm run dev"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:8080"
echo "   - Health Check: http://localhost:8080/health"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   - README.md - Project overview"
echo "   - SETUP_GUIDE.md - Detailed setup instructions"
echo "   - API_DOCUMENTATION.md - API reference"
echo "   - SECURITY.md - Security guidelines"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
