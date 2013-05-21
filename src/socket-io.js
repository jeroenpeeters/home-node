var socketio = require('socket.io')
    , x10 = require('./x10.js')
    , model = require('../model.json')

exports.init = function(server){

  var io = socketio.listen(server)

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

    socket.on('device-on', function (device) {
      x10.sendOn(device.address)
    })

    socket.on('device-off', function (device) {
      x10.sendOff(device.address)
    })

  })

}