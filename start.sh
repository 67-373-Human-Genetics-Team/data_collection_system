#!/bin/bash
# start.sh
# This starts the application with logging to mongo.log and node.log

# Handles hangup, ctrl+c, terminate, and ctrl+\
trap 'mongo <<EOF
use admin
db.shutdownServer()
EOF' 1 2 3 15

# Make sure logs folder exists
mkdir -p logs

# Start database server
mkdir -p db
mongod --fork --dbpath ./db --logpath ./logs/mongod-`date +%F-%H-%M-%S`.log

# Start node server
node app.js > ./logs/node-`date +%F-%H-%M-%S`.log 2>&1