var nosql = require('nosql')
var _ = require('underscore')
var pubsub = require('./pubsub')

//var device_db = nosql.load('./db/device.nosql')
var thermostat_db = nosql.load('./db/thermostat.nosql')
var x10_db = nosql.load('./db/x10_db.nosql')

exports.updateDevice = function(device) {
    device_db.update(function(doc) {
        if (doc.address == device.address) {
            return device;
        }
        return doc;
    })
}

exports.getThermostatHistory = function(callback) {
    var history = []
    thermostat_db.each(function(doc) {
        history.push(doc)
    }, function(){
        callback(_.last(history,1000))
    })
}

exports.getThermostatSinceDate = function(date, callback){
    thermostat_db.all(function(doc){
        return new Date(doc.date) > date
    }, callback)
}

/**
 * Read X10 events and save them to the database
 */
pubsub.on('/x10/event', function(event){
    x10_db.insert({
        date : new Date(),
        event : event
    })
})

/**
 * Read thermostat updates and save the to the database
 */
pubsub.on('/sensor/thermostat', function(thermostat) {
    thermostat_db.insert({
        date : new Date(),
        thermostat : thermostat
    })
})
