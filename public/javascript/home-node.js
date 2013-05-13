var socket = io.connect('http://192.168.1.10');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});
  
var APPLIENCES = 
  {'Beneden': 
    [{ name: "Buitenlamp", address: "b1" },
    { name: "Binnenlamp", address: "b2" }],
  'Eerste etage':
    [{ name: "Buitenlamp2", address: "b1" },
    { name: "Binnenlamp3", address: "b2" }],
  };
function AppliencesViewModel() {
  var self = this;
  
  self.rooms = ['Beneden', 'Eerste etage', 'Tweede etage', 'Tuin'];
  self.selectedRoomId = ko.observable();
  //self.roomAppliences = ko.observable();
  self.getRoomUrl = function(room) { 
    return '#' + room; 
  };
  
  self.myFunction = function(data) {
    console.log(data);
  }
 
  self.sendCommand = function(appliance){
    socket.emit('device', appliance );
  };

  self.availableAppliences = ko.observableArray();
  
  // Client-side routes    
  Sammy(function() {
    this.get('#:roomId', function() {
        self.selectedRoomId(this.params.roomId);
        self.availableAppliences(APPLIENCES[this.params.roomId]);
        //self.chosenMailData(null);
        //$.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
    });
    
    //Default routes forwards to first room
    this.get('', function() { this.app.runRoute('get', '#' + self.rooms[0]) });
  }).run();
}

ko.applyBindings(new AppliencesViewModel());