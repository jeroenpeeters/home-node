/**
 * Maintains the internal model
 */

var pubsub = require('./pubsub.js')
var model = require('../model.js')

exports.init = function(config) {
    
    var publish_model_update = function(){
        pubsub.publish('/model', model);
    }

    /**
     * Updates thermostat in model
     */
    pubsub.on('/sensor/thermostat', function(thermostat){
        
        model.thermostat = thermostat
        publish_model_update()
        
    })
    
    pubsub.on('/x10/event', function(event){
        for(room in model.devices){
            for(index in model.devices[room]){
                var device = model.devices[room][index]
                
                if(device.address.toLowerCase() === event.address.toLowerCase()){
                    device.state = event.cmd.toLowerCase()
                }
            }
        }
        publish_model_update()
    })
    
    
}