#!/bin/bash

# Log the time of the script execution
echo "Deployment started at $(date)" >> /root/TWMP/deployment.log

# Navigate to your project directory
cd /root/TWMP || exit

# Pull the latest code from the repository
git pull origin main

# Install any new dependencies
npm install

# Restart the server using systemd
sudo systemctl restart twmp

# Log the completion time of the script
echo "Deployment completed at $(date)" >> /root/TWMP/deployment.log

