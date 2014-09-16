#
# Plugin for Klik Aan Klik Uit devices
#
exec = require('child_process').exec
pubsub = require '../../pubsub'

exports.init = (app) ->
  config = app.config
  model = app.model

  console.log 'Initializing Klikaan-Klikuit Protocol Plugin'

  pubsub.on '/device/on', (device) ->
    unless device.config.type == 'kaku' then return

    exec "#{config.kaku.cmd} -g #{device.config.group} -n #{device.config.device} on"
    device.state = 'on'

    pubsub.publish '/model/devices', device


  pubsub.on '/device/off', (device) ->
    unless device.config.type == 'kaku' then return

    exec "#{config.kaku.cmd} -g #{device.config.group} -n #{device.config.device} off"
    device.state = 'off'

    pubsub.publish '/model/devices', device
