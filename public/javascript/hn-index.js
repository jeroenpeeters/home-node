function AppliencesViewModel() {
    var self = this;

    self.rooms = ko.observableArray();
    self.selectedRoomId = ko.observable();
    // self.roomAppliences = ko.observable();
    self.getRoomUrl = function(room) {
        return '#' + room;
    };
    self.thermostat = ko.observable();

    self.sendOnCommand = function(device) {
        socket.emit('device-on', device);
    };

    self.sendOffCommand = function(device) {
        socket.emit('device-off', device);
    };

    self.data = ko.observable();

    self.availableAppliences = ko.observableArray();

    self.initSliders = function() {
        $('.sl').slider({
            formater : function(value) {
                return 'Current value: ' + value;
            }
        });
    }

    var initSammy = function(room) {
        // Client-side routes
        Sammy(function() {
            this.get('#:roomId', function() {
                self.selectedRoomId(this.params.roomId);
                console.log(self.data()[this.params.roomId])
                self.availableAppliences(self.data()[this.params.roomId]);
                console.log(self.availableAppliences());
                // self.chosenMailData(null);
                // $.get("/mail", { folder: this.params.folder }, self.chosenFolderData);
            });

            // Default routes forwards to first room
            this.get('', function() {
                this.app.runRoute('get', '#' + room)
            });
        }).run();
    }
    
    var socket = io.connect(window.location.protocol + '//' + window.location.host + '/index' );
    socket.on('devices', function(devices) {
        var tmpRooms = new Array();
        for (property in devices) {
            tmpRooms.push(property);
        }
        self.rooms(tmpRooms);
        self.data(devices);
        initSammy(tmpRooms[0]);
    });

    socket.on('device-status', function(device) {
        console.log('device-status: ' + device);
    });
    socket.on('thermostat', self.thermostat)

}

ko.applyBindings(new AppliencesViewModel());