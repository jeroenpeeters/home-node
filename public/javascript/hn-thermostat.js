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
