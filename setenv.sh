#!/bin/bash

echo "Setting up environment variables"

export PORT=8080
export MAIL_PORT=465
export MAIL_HOST=smtp.mail.yahoo.com
export MAIL_USER=mexu.sl@yahoo.com
export MAIL_PASS=rdooytekacavmmnn
export PG_DB_PASSWORD=Mexu2023
export PG_DB_USERNAME=fimiz
export PG_DB_HOST=fimiz-blog-db.ccn2o7dzia1z.us-east-1.rds.amazonaws.com
export PG_DB_NAME=fimiz-blog-db
# export API_ACCESS_KEY=mexu2023medishk2
# export SMS_API_KEY=9d035dbc
# export SMS_SECRET_KEY=fUr53lsNeWpUL1iV
export ENV=production

echo "Done setting up environment variables"

echo "PORT :$PORT"


