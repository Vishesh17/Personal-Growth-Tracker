#!/bin/bash

echo "🚀 GitHub + Vercel Auto-Deploy Setup"
echo "====================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "📝 Step 1: Create GitHub Repository"
echo "   Go to: https://github.com/new"
echo "   Name: my-quest"
echo "   Keep it Private"
echo ""
read -p "Press Enter when repository is created..."

echo ""
echo "📝 Step 2: Enter your GitHub username:"
read -p "Username: " github_username

echo ""
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/$github_username/my-quest.git

echo ""
echo "📤 Pushing code to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushed to GitHub!"
    echo ""
    echo "📝 Step 3: Connect Vercel"
    echo "   1. Go to: https://vercel.com/dashboard"
    echo "   2. Click 'Add New' → 'Project'"
    echo "   3. Import your 'my-quest' repository"
    echo "   4. Click 'Deploy'"
    echo ""
    echo "✅ Done! Now every 'git push' auto-deploys!"
    echo ""
    echo "🎯 Daily workflow:"
    echo "   git add ."
    echo "   git commit -m 'your message'"
    echo "   git push"
    echo ""
else
    echo "❌ Push failed. Check your GitHub credentials."
fi
