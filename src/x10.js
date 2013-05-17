var net = require('net')

var PORT = 1099;
var HOST = 'localhost';

function sendx10(command, callback){

    var client = new net.Socket()
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT)
        client.write(command)
        client.destroy()
    })

    //client.on('data', function(data) {
    //    console.log('DATA: ' + data)
    //    client.destroy()
    //    callback(data);
    //});
}

// X10 commands

exports.sendOn = function(device_address, callback){
  console.log('pl ' + device_address + ' on');
  sendx10('pl ' + device_address + ' on\n', callback);
}

exports.sendOff = function(device_address, callback){
  console.log('pl ' + device_address + ' off');
  sendx10('pl ' + device_address + ' off\n', callback);
}

// Receive X10 Events from Mochad

exports.init = function(callback){

  var client = new net.Socket()
  client.connect(PORT, HOST, function() {
    console.log("Connected to Mochad")
  })

  client.on('data', function(data) {
    console.log('recv:' + data);
    callback(data);
  });
}
