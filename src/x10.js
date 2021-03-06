var net = require('net'), db = require('./db'), pubsub = require('./pubsub'), config = require('../config.json')

// X10 Commands code -->

function sendx10(command) {

    var client = new net.Socket()
    client.connect(config.mochad_port, config.mochad_host, function() {
        console.log('CONNECTED TO: ' + config.mochad_host + ':' + config.mochad_port)
        client.write(command)
        client.destroy()
    })
}

exports.sendOn = function(device_address) {
    console.log('pl ' + device_address + ' on')
    sendx10('pl ' + device_address + ' on\n')
}

exports.sendOff = function(device_address) {
    console.log('pl ' + device_address + ' off')
    sendx10('pl ' + device_address + ' off\n')
}

// <-- X10 Commands code

// Parse status information from Mochad -->

var commandPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)\r?\n?(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)\r?\n?/
var splitCommandsPattern = /(.+\n.+\n?)/

unwrapCommand = function(line) {
    return commandPattern.exec(line)
}

splitCommands = function(data) {
    var array = data.split(splitCommandsPattern);
    var newArray = Array();
    for ( var i = 0; i < array.length; i++) {
        if (array[i].length > 0) {
            newArray.push(array[i])
        }
    }
    return newArray
}

// <-- Parse status information from Mochad

// Receive X10 Events from Mochad -->

exports.init = function() {

    var client = new net.Socket()
    client.connect(config.mochad_port, config.mochad_host, function() {
        console.log("Connected to Mochad")
    })

    client.on('data', function(dataArray) {
        console.log('onData', String(dataArray));
        var data = '' + String(dataArray) // needed to convert char array to string
        var commands = splitCommands(data)

        for ( var i = 0; i < commands.length; i++) {
            cmdArray = unwrapCommand(commands[i])

            cmd = {
                txrx : cmdArray[6],
                iface : cmdArray[7],
                address : cmdArray[8],
                house : cmdArray[16],
                cmd : cmdArray[17]
            }
            pubsub.publish('/x10/event',  cmd);
        }
    });

    client.on('error', function(error){
        console.log("There was a problem connecting to Mochad, check your configuration!", error.code)
        process.exit(1)
    })
}

// <-- Receive X10 Events from Mochad

