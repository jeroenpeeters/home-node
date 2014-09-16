socketio = require 'socket.io'
pubsub = require './pubsub'
db = require './db'

io = null

exports.init = (server, app) ->
    config = app.config
    model = app.model
    io = socketio.listen server

    io.configure 'development', () ->
        console.log 'develop'
        io.set 'log level', 2
        io.set 'transports', [
            # 'websocket'
            # 'htmlfile'
            'xhr-polling'
            # , 'jsonp-polling'
        ]

    findInList = (obj, list, cb) ->
      for x in list
        if x._id == obj._id then cb x

    deviceHandler = (cb) -> (device) -> findInList device, model.devices, cb

    devicePublisher = (channel) -> deviceHandler (device) ->
      pubsub.publish channel, device

    # Index page connections
    index = io.of('/index').on 'connection', (socket) ->
        socket.emit 'devices', model.rooms
        socket.emit 'thermostat', model.thermostat

        # bridge socketio to internal message bus
        socket.on 'device-on', devicePublisher '/device/on'
        socket.on 'device-off', devicePublisher '/device/off'

    pubsub.on '/model', (model) ->
        index.emit 'devices', model.rooms
        index.emit 'thermostat', model.thermostat

    # Thermostat page connections
    thermostat = io.of('/thermostat').on 'connection', (socket) ->
        db.getThermostatHistory (history) ->
            socket.emit 'history', history
