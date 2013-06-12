var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , http = require('http')
    , socketio = require('./src/socket-io.js')
    , scheduler = require('./src/scheduler.js')
    , model_maintainer = require('./src/model_maintainer.js')
    , config = require('./config.json')
    
require('./src/x10.js').init()
    
var plugins = ['thermostat/greenwave-reality'];

var app = express()
var server = http.createServer(app)

require('./src/db.js')
model_maintainer.init(config);

for(i in plugins){
    var plugin = require('./src/plugins/' + plugins[i])
    plugin.init(config)
}

socketio.init(server)
scheduler.init()
//thermostat.init()

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

