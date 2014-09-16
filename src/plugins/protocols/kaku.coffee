#
# Plugin for Klik Aan Klik Uit devices
#
pubsub = require '../../pubsub'

exports.init = (app) ->
  config = app.config
  model = app.model

  console.log 'Initializing Klikaan-Klikuit Protocol Plugin'

  pubsub.on '/device/on', (device) ->
    unless device.config.type == 'kaku' then return

    device.state = 'on'

    pubsub.publish '/model/devices', device


  pubsub.on '/device/off', (device) ->
    unless device.config.type == 'kaku' then return

    device.state = 'off'

    pubsub.publish '/model/devices', device
