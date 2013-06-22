
var db = require('./src/db.js')

var date = new Date(new Date().getTime() - 15 * 60000);

db.getThermostatSinceDate(date, function(doc){
    console.log(doc)
})

var tavg = (22 + 21.5)/2

console.log(tavg)