var net = require('net'), config = require('./config.json')

var plCommandOnOffRegexp = /pl ([a-z][0-9]) (on|off)\r?\n?/

function getDateString() {
    var d = new Date()
    var month = d.getMonth() + 1
    return (month > 9 ? month : '0' + month) + "/" + (d.getDate() > 9 ? d.getDate() : '0' + d.getDate()) + " " + (d.getHours() > 9 ? d.getHours() : '0' + d.getHours()) + ":" + (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes())
            + ":" + (d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds()) + " ";
}

function PLOnOff(match) {
    var address = match[1].toUpperCase(), // ex: a1
    command = match[2] // on|off

    return getDateString() + "Tx PL HouseUnit: " + address + "\r\n" + getDateString() + "Tx PL House: " + address.charAt(0) + " Func: "
            + command.substr(0, 1).toUpperCase() + command.substr(1) + "\r\n";

    // 12/07 20:49:10 Tx PL HouseUnit: C3
    // 12/07 20:49:10 Tx PL House: C Func: Off
}

var sockets = []

net.createServer(function(sock) {

    sockets.push(sock)

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

    sock.on('data', function(data) {
        var match = null;

        var response = '';
        console.log(data);

        if ((match = plCommandOnOffRegexp.exec(data)) != null) {
            response = PLOnOff(match)
        } else {
            console.log('Unsupported Mochad command | ' + sock.remoteAddress + ': ' + data)
        }

      console.log(response);

        for (index in sockets) {
            sockets[index].write(response)
        }

    })

    sock.on('close', function(data) {
        sockets.splice(sockets.indexOf(sock), 1);
    })

}).listen(config.mochad_port, config.mochad_host)

console.log('Mochad Simulator listening on ' + config.mochad_host + ':' + config.mochad_port)
