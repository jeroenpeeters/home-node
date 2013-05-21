var houseUnitPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)/
var housePattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)/

var data = "12/17 01:19:50 Tx PL HouseUnit: A1\n12/17 01:19:51 Tx PL House: A Func: On\n12/17 01:19:51 Tx PL HouseUnit: B1\n12/17 01:19:51 Tx PL House: B Func: Off\n"

var commandPattern = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouseUnit:\s(.\d)\n(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s(Tx|Rx)\s(PL|RF)\sHouse:\s(.)\sFunc:\s(On|Off)\n?/

var splitCommandsPattern = /(.+\n.+\n?)/


unwrapCommand = function(line){
  return commandPattern.exec(line)
}

splitCommands = function(data){
  var array = data.split(splitCommandsPattern);
  var newArray = Array();
  for(var i = 0; i < array.length; i++){
    if(array[i].length > 0){
      newArray.push(array[i])
    }
  }
  return newArray
}


printMatch = function(match){
  for(var x = 0; x < match.length; x++){
      console.log(x + ":" + match[x])
    }
}

var commands = splitCommands(data);
printMatch(commands)
for(var i = 0; i < commands.length; i++){
  cmdArray = unwrapCommand(commands[i])

  cmd = {txrx: cmdArray[6], iface: cmdArray[7], address: cmdArray[8], house: cmdArray[16], cmd: cmdArray[17]}

  console.log(cmd)
  console.log('-----');
}
