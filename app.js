var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , schedule = require('node-schedule')
    , http = require('http')
    , socketio = require('socket.io')
    , x10 = require('./x10.js')

var app = express()
var server = http.createServer(app)
var io = socketio.listen(server)

io.configure('development', function(){
  io.set('transports', ['xhr-polling']);
});

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
    { src: __dirname + '/public'
    , compile: compile
    }
))

app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
    res.render('index',
        { title : 'Home' }
    )
})

+server.listen(8080);

var rule = new schedule.RecurrenceRule()
rule.second = 0
var j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});

var DEVICES = 
  {
    'Beneden':
      [
        { name: "Buitenlamp", address: "b1" },
        { name: "Binnenlamp", address: "b2" }
      ],
    'Eerste etage': 
      [
        { name: "Buitenlamp1", address: "b1" },
        { name: "Binnenlamp2", address: "b2" }
      ],
    'Tweede etage': 
      [
        { name: "Buitenlamp3", address: "b1" },
        { name: "Binnenlamp4", address: "b2" }
      ],
    'Tuin':
      [
        { name: "Schuurlamp buiten", address: "b2" },
        { name: "Schuurlamp binnen", address: "b1" }
      ]
  };

io.sockets.on('connection', function (socket) {
    socket.emit('devices', DEVICES);
    
    socket.on('device-on', function (device) {
      console.log(device);
      x10.sendOn(device.address, function(data){
        socket.emit('device-status', device );
      });
    });
    
    socket.on('device-off', function (device) {
      console.log(device);
      x10.sendOff(device.address, function(data){
        socket.emit('device-status', device );
      });
    });
    
});