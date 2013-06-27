socketio = require 'socket.io'
pubsub = require './pubsub'
x10 = require './x10'
db = require './db'
model = require '../model'

io = null

exports.init = (server) ->
    io = socketio.listen server

    io.configure 'development', () ->
        console.log 'develop'
        io.set 'transports', [
            # 'websocket'
            # 'htmlfile'
            'xhr-polling'
            # , 'jsonp-polling'
        ]

    # Index page connections
    index = io.of('/index').on 'connection', (socket) ->
        socket.emit 'devices', model.devices
        socket.emit 'thermostat', model.thermostat

        socket.on 'device-on', (device) ->
            x10.sendOn device.address

        socket.on 'device-off', (device) ->
            x10.sendOff device.address

    pubsub.on '/model', (model) ->
        index.emit 'devices', model.devices
        index.emit 'thermostat', model.thermostat

    # Thermostat page connections
    thermostat = io.of('/thermostat').on 'connection', (socket) ->
        db.getThermostatHistory (history) ->
            socket.emit 'history', history
