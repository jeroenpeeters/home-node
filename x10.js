var net = require('net')

function sendx10(command, callback){
    
    var PORT = 1099;
    var HOST = 'localhost';
    
    var client = new net.Socket()
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT)
        client.write(command)
        //client.destroy()
    })
    
    client.on('data', function(data) {
        console.log('DATA: ' + data)
        client.destroy()
        callback(data);
    });
}

function sendOn(device_address, callback){
  console.log('pl ' + device_address + ' on');
  sendx10('pl ' + device_address + ' on\n', callback);
}

function sendOff(device_address, callback){
  console.log('pl ' + device_address + ' off');
  sendx10('pl ' + device_address + ' off\n', callback);
}

exports.sendOn = sendOn

exports.sendOff = sendOff