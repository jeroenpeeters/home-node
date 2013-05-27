/**
 * Simple Publisher/Subscriber functionality for NodeJS
 */

var model = {}

var sub = function(event, callback){
    if( !model.hasOwnProperty(event) ){
        model[event] = []
    }
    model[event].push(callback)
    return [model[event], callback];
}

var pub = function(event, data){
    if( !model.hasOwnProperty(event) ){
        console.warn("Simple-PubSub: No listeners for", event)
        return
    }
    for(index in model[event]){
        model[event][index](data)
    }
}

var rem = function(handle){
    handle[0].splice(handle[0].indexOf(handle[1]), 1)
}

exports.on = sub

exports.publish = pub

exports.cancel = rem

//exports.on('/sensor/temperature', function(temperature){
//    console.log('tmp1:',temperature)
//})
//
//var h = exports.on('/sensor/temperature', function(temperature){
//    console.log('tmp2:',temperature)
//})
//
//exports.publish('/sensor/temperature', 25)
//
//exports.cancel(h)
//
//exports.publish('/sensor/temperature', 20)