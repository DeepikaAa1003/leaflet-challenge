// code for creating Advanced Map (Level 2)
function selectFaultWeight(slipRate){

    if(slipRate === "Greater than 5.0 mm/yr"){
        return 5;
    }else{
        return 0.4;
    }

}

function selectFaultStyle(feature) {
    return {
      color: "Green",
      // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
      fillColor: "Green",
      fillOpacity: 0.5,
      weight: selectFaultWeight(feature.properties.slip_rate)
    };
  }

// Store our API endpoint as queryUrl
const queryUrl = "static/data/qfaults_latest_quaternary.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
//   console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  FaultList = [];
  data.features.map(feature => {
        
      if(feature.properties.slip_rate === "Greater than 5.0 mm/yr"){
        FaultList.push(feature);
      }else if (feature.properties.slip_rate === "Between 1.0 and 5.0 mm/yr"){
          FaultList.push(feature);
      }
  });
  
  faultMarkers = L.geoJson(FaultList, {
    // Style each feature (in this case a neighborhood)
    style: selectFaultStyle,
    // Called on each feature
    onEachFeature: function(feature, layer) {
      
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h4>" + "Fault:"+ feature.properties.fault_name + "</h4> <hr> <h4>" + "Slip Rate:" + feature.properties.slip_rate + "</h4>");

    }
  });
  createMaps(faultMarkers);
});

function createMaps(faults){
lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

  const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  const baseMaps = {
      "Light": lightmap,
    "Dark": darkmap
  };
  // Create an overlay object
const overlayMaps = {
    //"Earthquakes": earthquakes,
    "Faults": faults
  };
  
  // Create a new map
  const myMap = L.map("map", {
    center: [46.7557, -136.6825],
    zoom: 5,
    layers: [darkmap, faults]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
}