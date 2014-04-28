# !/bin/bash
# start.sh
# This starts the application with logging to mongo.log and node.log


# Start database server
mkdir -p db
mongod --dbpath ./db > mongo- `date +%F-%H-%M-%S`.log 2>&1

# Start node server
node app.js > node-`date +%F-%H-%M-%S`.log 2>&1