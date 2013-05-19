var houseUnitPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)/
var housePattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)/

var data = "12/17 01:19:50 Tx PL HouseUnit: A1\n12/17 01:19:51 Tx PL House: A Func: On"

//linePattern.exec(data);

testHouseUnitPattern = function(line){
  return houseUnitPattern.exec(line)
}

testHousePattern = function(line){
  return housePattern.exec(line)
}


printMatch = function(match){
  for(var x = 0; x < match.length; x++){
      console.log(x + ":" + match[x])
    }
}

var lines = data.split('\n')
for(var i = 0; i < lines.length; i++){
  var line = lines[i]
  console.log('line: ' + lines[i])

  var match;
  if( match = testHouseUnitPattern(line) ){
    printMatch(match)
  }else if( match = testHousePattern(line) ){
    printMatch(match)
  }else{
    console.log('did not match')
  }
}


