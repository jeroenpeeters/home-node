/**
 * New node file
 */
var schedule = require('node-schedule'),
    socketio = require('./socket-io.js'),
    thermostat = require('./thermostat.js'),
    pubsub = require('./pubsub.js')
    
exports.init = function(){
    // update thermostat temperature every 5 minutes
    setInterval(function(){
        thermostat.getTemperature(function(temperature){
            pubsub.publish('/sensor/temperature/current', temperature)
            socketio.sendCurrentTempToClients(temperature)
        })
    }, 5 * 60000)
}


//var rule = new schedule.RecurrenceRule()
//rule.second = 0
//var j = schedule.scheduleJob(rule, function(){
//  console.log('The answer to life, the universe, and everything!');
//});