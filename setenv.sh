#!/bin/bash

echo "Setting up environment variables"

echo "export PORT=3000" >> ~/.bashrc
echo "export MAIL_PORT=465" >> ~/.bashrc
echo "export MAIL_HOST=smtp.mail.yahoo.com" >> ~/.bashrc
echo "export MAIL_USER=mexu.sl@yahoo.com" >> ~/.bashrc
echo "export MAIL_PASS=rdooytekacavmmnn" >> ~/.bashrc
echo "export DB_PASSWORD=Mexu2023" >> ~/.bashrc
echo "export DB_USERNAME=fimiz" >> ~/.bashrc
echo "export DB_PORT=5432" >> ~/.bashrc
echo "export DB_HOST=fimiz-blog-db.ccn2o7dzia1z.us-east-1.rds.amazonaws.com" >> ~/.bashrc
echo "export DB_NAME=fimiz-blog-db" >> ~/.bashrc
echo "export ENV=production" >> ~/.bashrc

echo "# Sourcing environment variables" >> ~/.bashrc
echo "source ~/.bash_custom" >> ~/.bashrc

echo "Done setting up environment variables"

# Create a custom script for sourcing environment variables
echo "#!/bin/bash" > ~/.bash_custom
echo "source ~/.bashrc" >> ~/.bash_custom
chmod +x ~/.bash_custom

echo "To apply the changes, restart your terminal or run 'source ~/.bashrc'"
