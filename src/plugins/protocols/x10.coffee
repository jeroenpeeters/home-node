#
# Plugin for X10 devices
#

net = require "net"
db = require "../../db"
pubsub = require "../../pubsub"

exports.init = (app) ->
  console.log 'Initializing X10 Protocol Plugin'

  readX10Events app

  pubsub.on '/device/on', (device) ->
    if device.config.type == 'x10' then sendOn device.config.address, app.config

  pubsub.on '/device/off', (device) ->
    if device.config.type == 'x10' then sendOff device.config.address, app.config

# X10 Commands code -->
sendx10 = (command, config) ->
  client = new net.Socket()
  client.connect config.mochad_port, config.mochad_host, ->
    console.log "CONNECTED TO: " + config.mochad_host + ":" + config.mochad_port
    client.write command
    client.destroy()

sendOn = (device_address, config) ->
  console.log "pl " + device_address + " on"
  sendx10 "pl " + device_address + " on\n", config

sendOff = (device_address, config) ->
  console.log "pl " + device_address + " off"
  sendx10 "pl " + device_address + " off\n", config


# <-- X10 Commands code

# Parse status information from Mochad -->
commandPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)\r?\n?(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)\r?\n?/
splitCommandsPattern = /(.+\n.+\n?)/
unwrapCommand = (line) ->
  commandPattern.exec line

splitCommands = (data) ->
  array = data.split(splitCommandsPattern)
  newArray = Array()
  i = 0

  while i < array.length
    newArray.push array[i]  if array[i].length > 0
    i++
  newArray


# <-- Parse status information from Mochad

# Receive X10 Events from Mochad -->
readX10Events = (app)->
  config = app.config
  model = app.model

  client = new net.Socket()
  client.connect config.mochad_port, config.mochad_host, ->
    console.log "Connected to Mochad"
    return

  client.on "data", (dataArray) ->
    console.log "onData", String(dataArray)
    data = "" + String(dataArray) # needed to convert char array to string
    commands = splitCommands(data)
    i = 0

    while i < commands.length
      cmdArray = unwrapCommand(commands[i])
      cmd =
        txrx: cmdArray[6]
        iface: cmdArray[7]
        address: cmdArray[8]
        house: cmdArray[16]
        cmd: cmdArray[17]

      for device in model.devices
        if device.config.type == 'x10' and device.config.address == cmd.address.toLowerCase()
          device.state = cmd.cmd.toLowerCase()
          pubsub.publish '/model/devices', device
      i++

  client.on "error", (error) ->
    console.log "There was a problem connecting to Mochad, check your configuration!", error.code
    process.exit 1


# <-- Receive X10 Events from Mochad
