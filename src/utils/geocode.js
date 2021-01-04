const request = require('request');

const geocode = (address, callback) => {
    const URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoic2hpdmFta3IyMTYiLCJhIjoiY2tqYTlzZ3BkNzh0NDJybGJ5OGI4cG4ycCJ9.KO_XfuLK_2ZaqRP8FqtaEw&limit=1';
    request({ url: URL, json: true }, (error, response) => {
        //console.log(response.body);
        if(error){
            callback('Unable to connect to weather service!', undefined);
        } else if(response.body.message || response.body.features.length===0){
            callback('Unable to find location. Try another search.', undefined);
        } else{
            callback(undefined, { latitude: response.body.features[0].center[1],
                                longitude: response.body.features[0].center[0],
                                location: response.body.features[0].place_name});
        }
    })
}

module.exports = geocode;