var nosql = require('nosql')
var pubsub = require('./pubsub')
var model = require('../model')

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
        callback(history)
    })
}

exports.getThermostatSinceDate = function(date, callback){
    thermostat_db.all(function(doc){
        return new Date(doc.date) > date
    }, callback)
}

/*var insert = function(device) {
    var filter = function(doc) {
        return doc.address == device.address
    }
    var count = function(count) {
        if (count == 0) {
            device_db.insert(device, 'Inserted new device on address ' + device.address)
        }
    }
    device_db.count(filter, count)
}*/

var init = function() {
    /*for (roomName in model.devices) {
        for ( var i = 0; i < model.devices[roomName].length; i++) {
            var device = model.devices[roomName][i];
            insert(device)
        }
    }*/
}

init()
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