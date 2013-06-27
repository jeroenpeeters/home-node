
schedule = require 'node-schedule'
pubsub = require './pubsub'
    
exports.init = () ->


###
var rule = new schedule.RecurrenceRule()
rule.second = 0
var j = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');
});
###