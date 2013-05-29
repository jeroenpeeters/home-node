var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , http = require('http')
    , socketio = require('./src/socket-io.js')
    , scheduler = require('./src/scheduler.js')
    , thermostat = require('./src/thermostat.js')
    , config = require('./config.json')

var app = express()
var server = http.createServer(app)

socketio.init(server)
scheduler.init()
thermostat.init()

//function compile(str, path) {
//    return stylus(str)
//        .set('filename', path)
//        .use(nib())
//}

app.set("view options", {layout: false});
//app.set('views', __dirname + '/views')
//app.set('view engine', 'jade')
//app.use(express.logger('dev'))
//app.use(stylus.middleware(
//    { src: __dirname + '/public'
//    , compile: compile
//    }
//))

app.use(express.static(__dirname + '/public'))

//app.get('/', function(req, res) {
//    res.render('index',
//        { title : 'Home' }
//    )
//})

server.listen(config.server_port);

