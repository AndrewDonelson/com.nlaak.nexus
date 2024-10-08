#!/bin/bash

# initialize project
echo "Initializing Project..."

npm install
npx convex dev --once --configure=new
npx convex env set SITE_URL http://localhost:3000

# Run the Node.js script and capture the output
output=$(node ./lib/generateKeys.mjs)

# Extract JWT_PRIVATE_KEY and JWKS from the output
JWT_PRIVATE_KEY=$(echo "$output" | sed -n 's/^JWT_PRIVATE_KEY="\(.*\)"$/\1/p' | sed 's/\\n/\n/g')
JWKS=$(echo "$output" | grep "JWKS=" | sed 's/JWKS=//')

# Encode JWT_PRIVATE_KEY to handle special characters and newlines
ENCODED_KEY=$(echo "$JWT_PRIVATE_KEY" | base64 -w 0)

# Set the environment variables in Convex
npx convex env set JWT_PRIVATE_KEY "$ENCODED_KEY"
npx convex env set JWKS "$JWKS"
echo "Environment variables have been set in Convex."

# Initialize GitHub repository
echo "Initializing GitHub repository..."

# Get the current directory name (project folder name)
project_name=$(basename "$(pwd)")

# Initialize git repository
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "Initial commit"

# Create a new repository on GitHub (requires GitHub CLI, assumes it's installed)
gh repo create "$project_name" --public --source=. --remote=origin

# Push changes to the remote repository
git push -u origin main

echo "GitHub repository initialized and changes pushed."

echo "Starting dev..."
npm run dev