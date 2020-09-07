// code for creating Basic Map (Level 1)

function createMaps(earthquakeMarkers){


        
        // Create a new map
        const myMap = L.map("map", {
          center:  [46.7557, -136.6825],
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
      
      //Add markers to map
      earthquakeMarkers.addTo(myMap);
      //Add legend to map
      createLegend(myMap);


}
// Store our API endpoint as queryUrl
 const geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

//const geoData = "static/data/earthquake_test.geojson";

function markerSize(magnitude) {

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
function markerColor(Significance) {
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



function pointToLayer(feature, location) {
  var options = {
    stroke: false,
    color: "#000",
    fillColor: markerColor(feature.properties.sig),
    radius: markerSize(feature.properties.mag),
    fillOpacity: 1,
    weight: 1,
    opacity: 1
  }

  return L.circleMarker(location, options);

}
   
   
  function addPopup(feature, layer) {
  
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h4> EarthQuake: ${feature.properties.place} </h4> <hr> <h4> Time: ${Date(feature.properties.time)} </h4> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <hr> <h4>Significance: ${feature.properties.sig} </h4> `);
}

d3.json(geoData, function(data) {
      
 // console.log(jsonData.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
      earthquakeMarkers = L.geoJSON(data.features, {
        
        pointToLayer: pointToLayer,
        
        // popup for each marker
        onEachFeature:  addPopup
        });
        createMaps(earthquakeMarkers);
        

  
  
});

 
function createLegend(myMap){

          // creating the legend
          var legend = L.control({position: 'bottomright'});

          // add legend to map
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
          legend.addTo(myMap);
    }
