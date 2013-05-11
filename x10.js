var net = require('net')

function sendx10(command){

    var client = new net.Socket()
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT)
        client.write(command)
    })
    
    client.on('data', function(data) {
        console.log('DATA: ' + data)
        client.destroy()
        // return data
    })

}

exports.send = sendx10
