var nosql = require('nosql')
    , model = require('../model.json')

var deviceDb = nosql.load('./deviceDb.nosql')


exports.updateDevice = function(device){
  deviceDb.update(function(doc){
    if(doc.address == device.address){
      return device;
    }
    return doc;
  })
}

var insert = function(device){
  var filter = function(doc){
    return doc.address == device.address
  }
  var count = function(count){
    if(count == 0){
      deviceDb.insert(device, 'Inserted new device on address ' + device.address)
    }
  }
  deviceDb.count(filter, count)
}

var init = function(){
  for( roomName in model){
    for(var i = 0; i < model[roomName].length; i++){
      var device = model[roomName][i];
      insert(device)
    }
  }
}

init()