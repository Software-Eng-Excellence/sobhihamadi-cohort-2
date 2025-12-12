# Start the app in pm2
# Navigate into the app directory ~/SE2
# Start using pm2 and ecosystem.config.js with env production

echo " 🚀 Starting the app in pm2"

cd ~/SE2 || exit
pm2 start ecosystem.config.js --env production

# Save the pm2 process list
pm2 save

# Print the pm2 status
echo " 📊 pm2 status:"
pm2 status

