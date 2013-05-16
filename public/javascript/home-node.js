
function AppliencesViewModel() {
  var self = this;

  var staticRooms;
  self.rooms = ko.observableArray();
  self.selectedRoomId = ko.observable();
  //self.roomAppliences = ko.observable();
  self.getRoomUrl = function(room) {
    return '#' + room;
  };

  self.sendOnCommand = function(appliance){
    socket.emit('device-on', appliance );
  };

  self.sendOffCommand = function(appliance){
    socket.emit('device-off', appliance );
  };

  self.data = ko.observableArray();

  self.availableAppliences = ko.observableArray();

  self.initSliders = function(){
    $('.sl').slider({
      formater: function(value) {
        return 'Current value: '+value;
      }
    });
  }

  var initSammy = function(){
    // Client-side routes
    Sammy(function() {
      this.get('#:roomId', function() {
          self.selectedRoomId(this.params.roomId);
          self.availableAppliences(self.data[this.params.roomId]);
          //self.chosenMailData(null);
          //$.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
      });

      //Default routes forwards to first room
      this.get('', function() { this.app.runRoute('get', '#' + staticRooms[0]) });
      console.log('initSammy: ' + staticRooms);
    }).run();
  }

  var socket = io.connect('http://home.peetersweb.nl:8080');
  socket.on('devices', function (devices) {
    console.log(devices);
    self.data = devices;
    var tmpRooms = new Array();
    for( property in devices ){
      tmpRooms.push(property);
    }
    staticRooms = tmpRooms;
    self.rooms(tmpRooms);
    initSammy();
  });

  socket.on('device-status', function(device) {
    console.log('device-status: ' + device);
  });

}

ko.applyBindings(new AppliencesViewModel());