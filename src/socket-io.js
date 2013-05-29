var socketio = require('socket.io')
    , pubsub = require('./pubsub.js')
    , x10 = require('./x10.js')
    , thermostat = require('./thermostat.js')
    , model = require('../model.json')
    
var io = null

exports.init = function(server){

  io = socketio.listen(server)

  io.configure('development', function(){
    console.log('develop')
    io.set('transports', [
      //  'websocket'
      //'htmlfile'
      'xhr-polling'
     // , 'jsonp-polling'
    ])
  })

  x10.init(function(data){
    io.sockets.emit('device-status', data)
  })

  io.sockets.on('connection', function (socket) {
    socket.emit('devices', model)
    
    thermostat.getStatus(function(status){
        socket.emit('thermostat', status)
    })

    socket.on('device-on', function (device) {
      x10.sendOn(device.address)
    })

    socket.on('device-off', function (device) {
      x10.sendOff(device.address)
    })

  })
  
  pubsub.on('/sensor/thermostat', function(status){
      io.sockets.emit('thermostat', status)
  })

}