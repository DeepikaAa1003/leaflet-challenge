// code for creating Basic Map (Level 1)

  
  // Create a new map
  const myMap = L.map("map", {
    center:  [37.0902, -95.7129],
    zoom: 5
  });

  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint as queryUrl
// const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

const geoData = "static/data/earthquake_test.geojson";

function markerSize(magnitude) {
  return magnitude * 10;
}

// function to return the color based on magnitude
function markerColor(magnitude) {
if (magnitude > 4) {
  return 'red'
} else if (magnitude > 3) {
  return 'orange'
} else if (magnitude > 2) {
  return 'yellow'
} else {
  return 'green'
}

var mapScale = chroma.scale(['#FFEDA0', '#800026'])
      .classes([0,1,2,3,4,5]);
    return mapScale(magnitude)
}

// function for opacity based on magnitude
function markerOpacity(magnitude) {
if (magnitude > 6) {
  return .99
} else if (magnitude > 5) {
  return .80
} else if (magnitude > 4) {
  return .70
} else if (magnitude > 3) {
  return .60
} else if (magnitude > 2) {
  return .50
} else if (magnitude > 1) {
  return .40
} else {
  return .30
}
}

d3.json(geoData, function(data) {
      
  function pointToLayer(feature, location) {
    var options = {
      stroke: false,
      fillOpacity: markerOpacity(feature.properties.mag),
      color: markerColor(feature.properties.sig),
      fillColor: markerColor(feature.properties.mag),
      radius: markerSize(feature.properties.mag)
    }
  
    return L.circleMarker(location, options);
  
  }
     
     
    function addPopup(feature, layer) {
    console.log("Inside Add POP up");
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
}
 // console.log(jsonData.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  
      L.geoJSON(data.features, {
        
        pointToLayer: pointToLayer,
        
        // popup for each marker
        onEachFeature:  addPopup
        }).addTo(myMap);
  
        
  
  
});

 



  
