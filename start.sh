#!/bin/bash
# start.sh
# This starts the application with logging to mongo.log and node.log

# Handles hangup, ctrl+c, terminate, and ctrl+\
trap 'mongo --eval "use admin; db.shutdownServer();"' 1 2 3 15

# Start database server
mkdir -p db
mongod --fork --dbpath ./db --logpath ./mongod-`date +%F-%H-%M-%S`.log

# Start node server
node app.js > node-`date +%F-%H-%M-%S`.log 2>&1