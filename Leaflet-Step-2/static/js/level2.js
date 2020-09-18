//Adding functions for earthquake layer

//Function to calculate marker size based on magnitude
function EarthquakemarkerSize(magnitude) {

  if(magnitude > 5.5) {
    return magnitude * 11;
  }
  else if (magnitude > 5) {
    return magnitude * 6;
  }
  else if (magnitude > 4){
    return magnitude * 3;
  }
  else {
  return magnitude * 0.5;
  }

  
}

// function to return the color based on magnitude
function EarthquakemarkerColor(Significance) {
    if (Significance >= 1000){
      return "#E24125"
    }
    else if (Significance >= 750){  
      return "#E5612A"
    }
    else if ( Significance >= 500){
      return "#E8812F"
    }
    else if( Significance >= 250){
      return "#ECA035"
    }
    else {
      return "#FFFFFF"
    }
}


// Function to create the marker
function pointToLayer(feature, location) {
  var options = {
    stroke: false,
    color: "#000",
    fillColor: EarthquakemarkerColor(feature.properties.sig),  // color of marker as per significance
    radius: EarthquakemarkerSize(feature.properties.mag), // size of marker as per Magnitude
    fillOpacity: 1,
    weight: 1,
    opacity: 1
  }

  return L.circleMarker(location, options);

}
   
//function to add pop up message to marker
function addPopup(feature, layer) {
  
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h4> EarthQuake: ${feature.properties.place} </h4> <hr> <h4> Time: ${Date(feature.properties.time)} </h4> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <hr> <h4>Significance: ${feature.properties.sig} </h4> `);
}

function createLegend(myMap){

  // creating the legend
  var legend = L.control({position: 'bottomright'});

  // creating the legend body
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var magRange = [0,250,500,750,1000];
    var colors = ["#FFFFFF", "#ECA035","#E8812F","#E5612A","#E24125"];
    var labels = ['<strong> EQ Significance </strong> <br><br>'];
 
    for (var i = 0; i < magRange.length; i++) {
      labels.push(
        "<i style='background: " + colors[i] + "'></i> " +
        magRange[i] + (magRange[i + 1] ? "&ndash;" + magRange[i + 1] + "<br>" : "+"))
        }  //ends for loop
        div.innerHTML = labels.join('<br>');
    
    return div;
    
  }
  //Adding legend to map
  legend.addTo(myMap);
}

//Add functions for Fault layer - Function to decide weight according to sliprate value
function selectFaultWeight(slipRate){

    if(slipRate === "Greater than 5.0 mm/yr"){
        return 5;
    }else{
        return 0.4;
    }

}

//Function for fault layer to decide color
function selectFaultStyle(feature) {
    return {
      color: "Green",
      fillColor: "Green",
      fillOpacity: 0.5,
      weight: selectFaultWeight(feature.properties.slip_rate)
    };
  }

// Store Fault JSON file link
// const faultURL = "static/data/qfaults_latest_quaternary.geojson";
const faultURL = "https://deepikaaa1003.github.io/leaflet-challenge/Leaflet-Step-2/static/data/qfaults_latest_quaternary.geojson";
// Store our API endpoint as geoData
const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";


//Read data for earthquake and fault lines

d3.json(geoData, function(data) {
  d3.json(faultURL, function(faultdata) {
      
  
   // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
      earthquakesMarkers =  L.geoJSON(data.features, {
         
         pointToLayer: pointToLayer,
         
         // popup for each marker
         onEachFeature:  addPopup
         });

      
        // Filter the fault data to use only fault line data having slip rate of `Greater than 5.0 mm/yr` and `Between 1.0 and 5.0 mm/yr`
        FaultList = [];
        faultdata.features.map(feature => {
              
            if(feature.properties.slip_rate === "Greater than 5.0 mm/yr"){
              FaultList.push(feature);
            }else if (feature.properties.slip_rate === "Between 1.0 and 5.0 mm/yr"){
                FaultList.push(feature);
            }
        });
        
        faultMarkers = L.geoJson(FaultList, {
          // select the style as green color
          style: selectFaultStyle,
          // Called on each feature
          onEachFeature: function(feature, layer) {
            
            // add a popup for each fault line
            layer.bindPopup("<h4>" + "Fault:"+ feature.properties.fault_name + "</h4> <hr> <h4>" + "Slip Rate:" + feature.properties.slip_rate + "</h4>");

          }
        });

         createMaps(earthquakesMarkers,faultMarkers);
        
 
  });
   
});
function createMaps(earthquakes, faults){

// Create the light Map layer
lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

//Create the dark map layer
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
  "Earthquakes": earthquakes,
  "Faults": faults
};
  
  // Create a new map
  const myMap = L.map("map", {
    center: [46.7557, -136.6825],
    zoom: 5,
    layers: [darkmap, earthquakes, faults]
  });

  // Create a layer control containing our baseMaps
  // adding an overlay Layer containing the earthquake GeoJSON and fault lines
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  createLegend(myMap);
}