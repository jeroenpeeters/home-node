express = require 'express'
stylus = require 'stylus'
nib = require 'nib'
http = require 'http'
socketio = require './src/socket-io.coffee'
scheduler = require './src/scheduler'
model_maintainer = require './src/model_maintainer'
x10 = require './src/x10'
config = require './config.json'

# Initialize the Model Maintainer module
model_maintainer.init config

# Initialize X10 module
x10.init()

# Load database module
#require './src/db.js'

# Active plugins
plugins = ['thermostat/greenwave-reality']

# Initialize the plugins
for pluginName in plugins
	plugin = require './src/plugins/' + pluginName
	plugin.init config

# Initialze Express application
app = express()
server = http.createServer app

# Configure Express application
app.set "view options", {layout : false}
app.use express.static( __dirname + '/public')

# Initialze Socket.io
socketio.init server

# Listen for incoming connections
server.listen config.server_port

# Initialize the scheduler module
