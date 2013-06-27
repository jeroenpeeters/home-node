###
    Maintains the internal model
###

pubsub = require './pubsub'
model = require '../model'

exports.init = (config) ->
    
    publish_model_update = () ->
        pubsub.publish '/model', model

    # Updates thermostat in model     
    pubsub.on '/sensor/thermostat', (thermostat) ->
        model.thermostat = thermostat
        publish_model_update()
    
    pubsub.on '/x10/event', (event) ->
        for room in model.devices
            for device in room
               # device = model.devices[room][index]
                
                if device.address.toLowerCase() == event.address.toLowerCase()
                    device.state = event.cmd.toLowerCase()
        publish_model_update()