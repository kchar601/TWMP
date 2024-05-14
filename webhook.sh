#!/bin/bash

# Log the time of the script execution
echo "Deployment started at $(date)" >> /TWMP/deployment.log

# Navigate to your project directory
cd /TWMP || exit

# Pull the latest code from the repository
git pull origin main

# Install any new dependencies
npm install

# Restart the server using PM2
pm2 restart all # Ensure your app is managed by PM2

# Log the completion time of the script
echo "Deployment completed at $(date)" >> /TWMP/deployment.log
