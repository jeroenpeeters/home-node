###
Application model
###

lamp = (name, config) ->
  name: name
  state: "off"
  config: config

x10   = (name, address) -> lamp(name, type: "x10", address: address)
kaku  = (name, group, device) -> lamp(name, type: "kaku", group: group, device: device)

schemerlamp       = kaku "Schemerlamp", "12493714", 0
pianolamp         = kaku "Lamp op Piano", "12493714", 1
schuurlamp_buiten = x10 "Schuurlamp buiten", "b1"
schuurlamp_binnen = x10 "Schuurlamp binnen", "b2"

exports.devices = [
  pianolamp
  schemerlamp
  schuurlamp_buiten
  schuurlamp_binnen
]

exports.rooms =
  Huiskamer: [
    schemerlamp
    pianolamp
  ]
  Tuin: [
    schuurlamp_buiten
    schuurlamp_binnen
  ]


# Models the thermostat state
exports.thermostat =
    current_temp : 0
    heating_temp : 0
    boiler_active : false

#append an id to all devices
uuid = require 'node-uuid'
for device in exports.devices
  device._id = uuid.v4()
