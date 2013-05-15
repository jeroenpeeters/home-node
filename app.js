var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , schedule = require('node-schedule')
    , http = require('http')
    , socketio = require('./socket-io.js')

var app = express()
var server = http.createServer(app)
socketio.init(server)

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

server.listen(8080);

//var rule = new schedule.RecurrenceRule()
//rule.second = 0
//var j = schedule.scheduleJob(rule, function(){
//    console.log('The answer to life, the universe, and everything!');
//});
