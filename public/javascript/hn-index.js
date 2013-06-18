/**
 * Socket.io socket
 */
var socket = null;

/**
 * Cient side view routes using Sammy
 * 
 * @param viewModel
 */
function initSammy(viewModel) {
    Sammy(function() {

        this.get('#thermostat', function() {
            init_thermostat()
            viewModel.selectedView('thermostat')
            viewModel.selectedRoomId(null)
            viewModel.availableAppliences(null)
        })

        this.get('#:roomId', function() {
            viewModel.selectedView('appliance')
            viewModel.selectedRoomId(this.params.roomId)
            viewModel.availableAppliences(viewModel.data()[this.params.roomId])
        })

        // Default routes forwards to first room
        this.get('', function() {
            // this.app.runRoute('get', '#' + room)
            viewModel.selectedView('dashboard')
        })
    }).run()
}

/**
 * Initializes the application and updates the view-model
 * 
 * @param viewModel
 */
function appInit(viewModel) {
    var flag = true;
    socket = io.connect(window.location.protocol + '//' + window.location.host + '/index');
    socket.on('devices', function(devices) {
        var tmpRooms = new Array();
        for (property in devices) {
            tmpRooms.push(property);
        }
        viewModel.rooms(tmpRooms);
        viewModel.data(devices);
        if (viewModel.selectedRoomId()) {
            viewModel.availableAppliences(viewModel.data()[viewModel.selectedRoomId()]);
        }

        // init sammy after the viewModel has been populated with data
        if (flag) {
            initSammy(viewModel)
            flag = false;
        }
    });

    // update viewModel on reception of updates from server
    socket.on('device-status', function(device) {
        console.log('device-status: ' + device);
    });
    socket.on('thermostat', viewModel.thermostat)

}

/**
 * Knockout.js ViewModel
 */
function HomeNodeViewModel() {
    var self = this;

    self.selectedView = ko.observable('  ');

    self.rooms = ko.observableArray();
    self.selectedRoomId = ko.observable();
    // self.roomAppliences = ko.observable();
    self.getRoomUrl = function(room) {
        return '/#' + room;
    };
    self.thermostat = ko.observable();

    self.sendOnCommand = function(device) {
        socket.emit('device-on', device);
    };

    self.sendOffCommand = function(device) {
        socket.emit('device-off', device);
    };

    self.data = ko.observableArray();

    self.availableAppliences = ko.observableArray();

    appInit(this);
}

ko.bindingHandlers.fadeVisible = {
    init : function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update : function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).toggle(false);
    }
};

ko.bindingHandlers.simpleSlider = {
    init : function(element, valueAccessor, allBindingsAccessor) {
        // var options = allBindingsAccessor().sliderOptions || {};
        $(element).simpleSlider({range : [0,10], 'step' : 1, 'snap' : true, 'highlight' : true, 'theme' : 'volume' });
        ko.utils.registerEventHandler(element, "slider:changed", function(event, data) {
            console.log(data)
            var observable = valueAccessor();
            //observable(data.value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            // $(element).slider("destroy");
        });
        ko.utils.registerEventHandler(element, "slide", function(event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
    },
    update : function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value))
            value = 0;
        $(element).simpleSlider("setValue", value);
    }
};

$.getScript('/javascript/hn-thermostat.js', function() {
    ko.applyBindings(new HomeNodeViewModel());
});
