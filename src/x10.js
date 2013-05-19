var net = require('net')
    , db = require('./db.js')
    , config = require('../config.json')


// X10 Commands code -->

function sendx10(command){

    var client = new net.Socket()
    client.connect(config.mochad_port, config.mochad_host, function() {
        console.log('CONNECTED TO: ' + config.mochad_host + ':' + config.mochad_port)
        client.write(command)
        client.destroy()
    })
}

exports.sendOn = function(device_address){
  console.log('pl ' + device_address + ' on')
  sendx10('pl ' + device_address + ' on\n')
}

exports.sendOff = function(device_address){
  console.log('pl ' + device_address + ' off')
  sendx10('pl ' + device_address + ' off\n')
}

// <-- X10 Commands code

// Parse status information from Mochad -->

//Ex: 12/17 01:19:50 Tx PL HouseUnit: A1\n
var houseUnitPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)/
//Ex: 12/17 01:19:51 Tx PL House: A Func: On
var housePattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)/

testHouseUnitPattern = function(line){
  return houseUnitPattern.exec(line)
}

testHousePattern = function(line){
  return housePattern.exec(line)
}

printMatch = function(match){
  for(var x = 0; x < match.length; x++){
      console.log(x + ":" + match[x])
    }
}


// <-- Parse status information from Mochad

// Receive X10 Events from Mochad -->

exports.init = function(callback){

  var client = new net.Socket()
  client.connect(config.mochad_port, config.mochad_host, function() {
    console.log("Connected to Mochad")
  })

  var linePattern = /(.*\n)+/

  client.on('data', function(data) {
    console.log('recv:' + data)

    var lines = data.split('\n')
    for(var i = 0; i < lines.length; i++){
      var line = lines[i]
      console.log('line: ' + lines[i])

      var match;
      if( match = testHouseUnitPattern(line) ){
        printMatch(match)
        callback(match)
      }else if( match = testHousePattern(line) ){
        printMatch(match)
        callback(match)
      }else{
        console.log('did not match')
      }
    }

    //device.state = "on"
    //db.updateDevice(device)
  });
}

// <-- Receive X10 Events from Mochad

