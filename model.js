/**
 * Application model
 */

/**
 * Model of all available devices
 */
exports.devices = {
    "Beneden" : [],
    "Eerste etage" : [],
    "Tweede etage" : [],
    "Tuin" : [ {
        "name" : "Schuurlamp buiten",
        "address" : "b2",
        "state" : "off"
    }, {
        "name" : "Schuurlamp binnen",
        "address" : "b1",
        "state" : "off"
    } ]
};

/**
 * Models the thermostat state
 */
exports.thermostat = {
    current_temp : 0,
    heating_temp : 0,
    boiler_active : false,
    trend: '0'
}
