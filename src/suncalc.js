var SunCalc = require('suncalc');

var date = new Date(2013, 5-1, 19)
    , lat = 52.1672
    , lng = 4.5346

var di = SunCalc.getTimes(date, lat, lng)
console.log(di)
