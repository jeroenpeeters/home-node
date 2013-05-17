var socketio = require('socket.io')
    , x10 = require('./x10.js')
    , model = require('./../model.js')

exports.init = function(server){

  var io = socketio.listen(server)

  io.configure('development', function(){
    console.log('develop')
    io.set('transports', [
      //  'websocket'
      //'htmlfile'
      'xhr-polling'
     // , 'jsonp-polling'
    ]);
  });

  x10.init(function(data){
    io.sockets.emit('device-status', 'test: '+data)
  })

  io.sockets.on('connection', function (socket) {
    socket.emit('devices', model.devices);

    socket.on('device-on', function (device) {
      console.log(device);
      x10.sendOn(device.address, function(data){
        //socket.emit('device-status', device );
      });
    });

    socket.on('device-off', function (device) {
      console.log(device);
      x10.sendOff(device.address, function(data){
        //socket.emit('device-status', device );
      });
    });

  });

}