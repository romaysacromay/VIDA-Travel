#!/bin/bash

# Script to connect local repository to GitHub
# Usage: ./setup-github.sh YOUR_GITHUB_USERNAME REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./setup-github.sh YOUR_GITHUB_USERNAME REPO_NAME"
    echo "Example: ./setup-github.sh johndoe vida-travel"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2

echo "Adding GitHub remote..."
git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done! Your repository is now connected to GitHub."
echo "View it at: https://github.com/${GITHUB_USER}/${REPO_NAME}"

