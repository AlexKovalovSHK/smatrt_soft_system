#!/bin/bash

# Smart Soft System - Deployment Script
# This script helps deploy the landing page to a server

set -e

echo "🚀 Smart Soft System Deployment Script"
echo "======================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose build

echo ""
echo "✅ Build completed successfully!"
echo ""

# Start the container
echo "🚀 Starting container..."
docker-compose up -d

echo ""
echo "✅ Container started successfully!"
echo ""
echo "🌐 Your site is now available at: http://localhost:8080"
echo ""
echo "📝 Useful commands:"
echo "   - View logs:        docker-compose logs -f"
echo "   - Stop container:   docker-compose down"
echo "   - Restart:          docker-compose restart"
echo ""
