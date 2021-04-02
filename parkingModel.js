// parkingModel.js

var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var concat = require('concat-stream');

parser.on('error', function (err) { console.log('Parser error', err); });

// Setup schema
const parkingSchema = ({
    name: {
        type: String,
        required: true
    },
    state: String,
    free: String,
    total: String,
    address: String,
    position: Array, // lat, long -> separate by space
    distance: Number, // in kilometers
});

// Get parkings info and transform in JSON format
function get_all_parkings(callback) {
    var parkings = Array();

    http.get('http://data.lacub.fr/wfs?key=9Y2RU3FTE8&SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&TYPENAME=ST_PARK_P&SRSNAME=EPSG:4326', function (resp) {

        resp.on('error', function (err) {
            console.log('Error while reading', err);
        });

        resp.pipe(concat(function (buffer) {
            var str = buffer.toString();
            parser.parseString(str, function (err, result) {
                // console.log('Finished parsing:', err, result);
                result['wfs:FeatureCollection']['gml:featureMember'].forEach(parking => {
                    var newPark = Object.create(parkingSchema);
                    newPark.name = parking['bm:ST_PARK_P'][0]['bm:NOM'];
                    newPark.state = parking['bm:ST_PARK_P'][0]['bm:ETAT'];
                    newPark.free = parking['bm:ST_PARK_P'][0]['bm:LIBRES'];
                    newPark.total = parking['bm:ST_PARK_P'][0]['bm:TOTAL'];
                    newPark.address = parking['bm:ST_PARK_P'][0]['bm:ADRESSE'];
                    newPark.position = parking['bm:ST_PARK_P'][0]['bm:geometry'][0]["gml:Point"][0]["gml:pos"];
                    parkings.push(newPark);
                });
                // console.log(parkings);
                callback(err, parkings);
            });
        }));
    });
}

// Calculate and return distance between two positions, to put in another folder with the others common func
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

// Get parkings info near position and transform in JSON format
function get_parkings_near_me(position, callback) {
    var nearestParkings = Array();
    arrayPos = position.split(' ');
    if (arrayPos.length < 2 || arrayPos.length > 2){
        callback("Please enter a valid position with lat and long separate by a ' '", null);
    }
    get_all_parkings(function (err, parkings) {
        if (err) {
            callback(err, null);
        } else {
            parkings.forEach(parking => {
                arrayPosParking = parking.position[0].split(' ');
                if (arrayPosParking.length == 2){
                    console.log(Number(arrayPos[0]), Number(arrayPos[1]), Number(arrayPosParking[0]), Number(arrayPosParking[1]));
                    parking.distance = getDistanceFromLatLonInKm(Number(arrayPos[0]), Number(arrayPos[1]), Number(arrayPosParking[0]), Number(arrayPosParking[1]));
                    if (parking.distance <= 2) {
                        nearestParkings.push(parking);
                    }
                }
            });
            callback(err, nearestParkings);
        }
    });
}

// Export parking model
module.exports.get = get_all_parkings;
module.exports.get_with_position = get_parkings_near_me;