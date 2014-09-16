###
    Maintains the internal model
###

pubsub = require './pubsub'

exports.init = (app) ->
    config = app.config
    model = app.model

    publish_model_update = () ->
        pubsub.publish '/model', model

    # Updates thermostat in model
    pubsub.on '/sensor/thermostat', (thermostat) ->
        model.thermostat = thermostat
        publish_model_update()

    pubsub.on '/model/devices', publish_model_update
