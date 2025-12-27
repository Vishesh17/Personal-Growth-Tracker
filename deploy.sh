#!/bin/bash

# Quick Deployment Script for My Quest App

echo "🚀 My Quest - Quick Deploy"
echo "=========================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Build the app
echo "📦 Building app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    
    # Deploy
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Deployment successful!"
        echo ""
        echo "📱 Next steps:"
        echo "1. Open the URL on your phone"
        echo "2. Add to Home Screen"
        echo "3. Start tracking your goals!"
        echo ""
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
