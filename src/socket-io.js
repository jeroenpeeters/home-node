var socketio = require('socket.io'), pubsub = require('./pubsub.js'), x10 = require('./x10.js'), db = require('./db.js'), model = require('../model.js')

var io = null

exports.init = function(server) {

    io = socketio.listen(server)

    io.configure('development', function() {
        console.log('develop')
        io.set('transports', [
        // 'websocket'
        // 'htmlfile'
        'xhr-polling'
        // , 'jsonp-polling'
        ])
    })


    // Index page connections
    var index = io.of('/index').on('connection', function(socket) {
        socket.emit('devices', model.devices)
        socket.emit('thermostat', model.thermostat)

        socket.on('device-on', function(device) {
            x10.sendOn(device.address)
        })

        socket.on('device-off', function(device) {
            x10.sendOff(device.address)
        })

    })
    pubsub.on('/model', function(model) {
      index.emit('devices', model.devices)
      index.emit('thermostat', model.thermostat)
    })

    // Thermostat page connections
    var thermostat = io.of('/thermostat').on('connection', function(socket){
        db.getThermostatHistory(function(history){
            socket.emit('history', history)
        })
    })

}