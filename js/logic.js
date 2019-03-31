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
    "Major Earthquakes": majorQuakes,
    // "Plate Boundries" : majorPlates
  };

  var map = L.map("map-id", {
    center: [37.68, -97.33],
    zoom: 5,
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
var legend = L.control({
    position: "topright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var lables = "<h1>0-1</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";
    return div;
  };

  legend.addTo(map);

  
}

function createMarkers(response) {
    var quakes= response.features;
    var quakeMarkers = []
  
    for (var i=0; i < quakes.length; i++) {
        var quake = quakes[i];
        var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
            color : chooseColor(quake.properties.mag),
            fillColor : chooseColor(quake.properties.mag),
            fillOpacity : 1,
            radius:  quake.properties.mag * 15000
        })
            .bindPopup("<h3>Magnitude: " + quake.properties.mag + "<h3><h3>Time: " + quake.properties.place + "<h3>");
        quakeMarkers.push(quakeMarker);
    }
    let markerLayerGroup = L.layerGroup(quakeMarkers);
    createQuakes(markerLayerGroup);
}
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
d3.json(url, createMarkers);
function chooseColor(mag) {
    switch (true) {
    case  mag <= 1:
      return "#fefcea"
      break;      
    case mag <= 2 :
      return "#c5e534 ";
      break;
    case mag <= 3:
      return "#c5e534";
      break;
    case mag <= 4 :
      return "#f1f438";
      break;
    case mag <= 5 :
      return "#f1f438";
      break
    case mag <= 6 :
      return "#e29f34";
      break
    case mag <= 7 :
      return "#f93939";
    }
  }





// function createLines(response) {
//     var plates= response;
//     var plateBoundries = []
  
//     for (var i=0; i < plates.length; i++) {
//         var plate = plates[i];

//         var plateBoundry = L.polyline([plate.coordinates[1], quake.coordinates[0]])
//         console.log(plate)

//         plateBoundries.push(plateBoundry);
//     }
//     let lineLayerGroup = L.layerGroup(plateBoundries);
//     createQuakes(lineLayerGroup);

// }
// let lineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
// d3.json(lineUrl, createLines)