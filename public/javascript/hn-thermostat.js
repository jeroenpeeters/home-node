function init_thermostat() {

    var socket = io.connect(window.location.protocol + '//' + window.location.host + '/thermostat');
    socket.on('history', function(data) {
        //console.log('d:' + data)
        init_chart(data)
    });
}

function init_chart(data) {
    var chart_data = []
    var chart_data2 = []
    for (index in data) {
        chart_data.push([ new Date(data[index].date).getTime(), data[index].thermostat.current_temp ])
        chart_data2.push([ new Date(data[index].date).getTime(), data[index].thermostat.heating_temp ])
    }
    $('#container_thermostat').highcharts(
            {
                chart : {
                    zoomType : 'x',
                    spacingRight : 20
                },
                title : {
                    text : 'Thermostat'
                },
                subtitle : {
                    text : 'Thermostat details'
                },
                xAxis : {
                    type : 'datetime',
                    // maxZoom: 1 * 24 * 3600000, // 1 days
                    dateTimeLabelFormats : { // don't display the dummy year

                    }
                },
                yAxis : {
                    title : {
                        text : 'Temperature (C)'
                    },
                    min : 15,
                    max : 25
                },
                tooltip : {
                    formatter : function() {
                        // return '<b>'+ this.series.name +'</b><br/>'+
                        return '<b>' + Highcharts.dateFormat('%A %e %B', this.x) + '</b><br/>' + Highcharts.dateFormat('%H:%M', this.x) + ' - '
                                + this.y + ' C';
                    }
                },
                plotOptions : {
                    spline : {
                        lineWidth : 2,
                        states : {
                            hover : {
                                lineWidth : 4
                            }
                        },
                        marker : {
                            enabled : false
                        }
                    }
                },
                series : [ {
                    name : 'Current temperature',
                    type : 'spline',
                    // Define the data points. All series have a dummy year
                    // of 1970/71 in order to be compared on the same x axis. Note
                    // that in JavaScript, months start at 0 for January, 1 for February etc.
                    data : chart_data
                }, {
                    name : 'Preferred temperature',
                    type : 'spline',
                    data : chart_data2
                } ],

            });
}