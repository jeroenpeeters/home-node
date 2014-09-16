#
# Simple Publisher/Subscriber functionality for NodeJS
#

model = {}

sub = (event, callback) ->
  unless model.hasOwnProperty event
    model[event] = []
  model[event].push callback
  #[model[event], callback];  -- is this needed?

pub = (event, data) ->
  unless model.hasOwnProperty event
    console.warn("Simple-PubSub: No listeners for", event)
  else
    callback data for callback in model[event]

remove = (handle) ->
  handle[0].splice handle[0].indexOf(handle[1]), 1

exports.on = sub
exports.publish = pub
exports.cancel = remove

