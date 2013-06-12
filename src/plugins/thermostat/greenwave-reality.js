/**
 * GreenWave Reality Thermostat
 */
var http = require('https'), crypto = require('crypto'), pubsub = require('../../pubsub.js')

exports.init = function(config) {
    var gw_host = config.gw_host, gw_path = config.gw_path, gw_username = config.gw_username, gw_password = config.gw_password

    console.log("Init GreenWave Reality Thermostat Plugin:", config.gw_host)

    function doGWRequest(cmd, data, callback) {
        var post_data = 'cmd=' + cmd + '&fmt=json&data=<gip><version>1</version>' + encodeURIComponent(data) + '</gip>'
        var options = {
            host : gw_host,
            path : gw_path,
            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : post_data.length
            }
        }

        // Set up the request
        var post_req = http.request(options, function(res) {
            var data = '';
            var finalize = function() {
                callback(JSON.parse(data))
            }
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                data += chunk
            });
            res.on('end', finalize)
            res.on('close', finalize)
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    }

    function buildQuery(options) {
        var stringArr = []
        for (property in options) {
            stringArr.push('<')
            stringArr.push(property)
            stringArr.push('>')
            stringArr.push(options[property])
            stringArr.push('</')
            stringArr.push(property)
            stringArr.push('>')
        }
        return stringArr.join('')
    }

    function isSuccessful(json) {
        return json.gip.rc == 200;
    }
    function isInvalidLogin(json) {
        return json.gip.rc == 400 || json.gip.rc == 401 || json.gip.rc == 403
    }

    var token = null;

    function getToken(callback, forceLogin) {
        // set default values for parameters
        forceLogin = typeof forceLogin !== 'undefined' ? forceLogin : false;
        // return token if we have one cached
        if (token != null && !forceLogin) {
            callback(token);
            return;
        }
        // otherwise get new token
        var md5sum = crypto.createHash('md5');
        md5sum.update(gw_password)
        var query = buildQuery({
            'email' : gw_username,
            'password' : md5sum.digest('hex')
        })
        doGWRequest('GWRLogin', query, function(json) {
            if (isSuccessful(json)) {
                token = json.gip.token
                callback(token)
            } else {
                console.error("GWRLogin failed: ", json)
                callback(null)
            }
        })
    }

    function buildStatus(json) {
        return {
            current_temp : parseFloat(json.gip.thermostat.tempin) + config.temp_correction,
            heating_temp : parseFloat(json.gip.thermostat.tempsetheat),
            boiler_active : json.gip.thermostat.boilerstatus == '1'
        }
    }

    function getStatus(statusCallback) {
        var refreshToken = true

        var callback = function(token) {
            console.log(token)
            var query = buildQuery({
                'token' : token
            })

            doGWRequest('UserThermostatGetData', query, function(json) {
                if (isSuccessful(json)) {
                    var status = buildStatus(json)
                    statusCallback(status)
                } else if (refreshToken && isInvalidLogin(json)) {
                    console.warn('UserThermostatGetData failed because of invalid token, trying to refresh access token: ', json)
                    refreshToken = false;
                    getToken(callback)
                } else {
                    statusCallback(null)
                }
            })
        }

        getToken(callback)
    }

    function getAndPublishStatus() {
        getStatus(function(temperature) {
            pubsub.publish('/sensor/thermostat', temperature)
        })
    }
    
    // Refresh after init
    getAndPublishStatus()
    
    // Refresh every 5 minutes
    setInterval(getAndPublishStatus, 5 * 60000)

}

