# Leaflet Homework - Visualizing Data with Leaflet

## Background

Creating a codebase that will help visualizing earthquake data from United States Geological Survey. 


### Level 1: Basic Visualization


First part is to visualize an earthquake data set.

1. **Data set**
   Used the following dataset to plot earthquakes on geomap,
   [Past 30 Days M1.0+ Earthquakes](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson)

  Used the important fields like `mag`, `sig` and `time` under the keys features -> properties

2. **Import & Visualize the Data**

   Created a map using Leaflet that plots all of the earthquakes from data set based on their longitude and latitude.
   * Data markers reflects the magnitude of the earthquake in their size and and the significance of earthquake in their color. Earthquakes with higher magnitudes appear larger and those with higher significance  appear darker in color.
   * Included popups that provide additional information about the earthquake when a marker is clicked.

   * Created a legend that will provide context for map data

### Level 2: More Data 

Used a second data set to plot on map to illustrate the relationship between earthquakes and fault-lines. The data is stored in (static/data/qfaults_latest_quaternary.geojson) in the static/data folder.

* Plotted a second data set on map.

* Plotted only the fault-lines which have the following slip_rate values,
`Greater than 5.0 mm/yr` and `Between 1.0 and 5.0 mm/yr`

* Used a higher stroke-weight for fault-lines with higher slip_rate

* Added a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

* Added layer controls to map

* Included popups that provide additional information about the fault when a fault-line is clicked.

