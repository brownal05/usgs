function createQuakes(majorQuakes) {
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var baseMaps = {
    "Light Map": lightmap
  };

  var overlayMaps = {
    "Major Earthquakes": majorQuakes
  };

  var map = L.map("map-id", {
    center: [37.68, -97.33],
    zoom: 10,
    layers: [lightmap, majorQuakes]
  });  
//   var map = L.map("map-id", {
//     center: [37.68, -97.33],
//     zoom: 10,
//     layers: [
//       layers.majorQuakes,
//       layers.smallQuakes,
//       layers.plateLines,
//     ]
//   });

lightmap.addTo(map);

// var overlays = {
//     "<= 6.0 Magnitude Quake" : majorQuakes,
//     "> 6.0 Magnitude Quake" : smallQuakes,
//     "Tectonic Plate Boundries" : plateLines
// }

L.control.layers(baseMaps, overlayMaps).addTo(map);
var info = L.control({
    position: "topright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };

  info.addTo(map);
}

function createMarkers(response) {
    var quakes= response.features;
    var quakeMarkers = []
  
    for (var i=0; i < quakes.length; i++) {
        var quake = quakes[i];
        console.log(quake)
        var quakeMarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
            .bindPopup("<h3>" + quake.properties.mag + "<h3><h3>Time: " + quake.properties.place + "<h3>");
        quakeMarkers.push(quakeMarker);
    }
    let markerLayerGroup = L.layerGroup(quakeMarkers);
    createQuakes(markerLayerGroup);
}
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
d3.json(url, createMarkers);

