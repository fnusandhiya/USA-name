var AccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

/*url = "/sqlite"
var newData;
d3.json(url).then(function(data) {
    newData = JSON.parse(data);
    //console.log(newData);
});*/

// Select the submit button
var submit = d3.select("#submit");
// console.log(submit);
submit.on("click", function () {

    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#searchBox").property("value")
    console.log(inputElement);

    //console.log(inputElement);
    d3.json('/my?name=' + inputElement).then(function (data) {
            var newData = JSON.parse(data);
            //console.log(newData);

            // Get the value property of the input element
            //var inputValue = inputElement.property("value");

            //console.log(people);
            let filteredData = newData
            filteredData = filteredData.filter(names => names.Name === inputElement);
            console.log(filteredData)
            // console.log(filteredData.length)

            var names = filteredData.map(name => name.Name);
            if (filteredData.length === 0) {
                alert("Sorry!! We can not find that name....");
                d3.select(".summary li").remove();
                

                var years = filteredData.map(years => name.Year);
                var states = filteredData.map(states => name.State);
                var occurrences = filteredData.map(names => name.Occurrence);
                console.log(names);
            return false;
            };

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + AccessToken, {
                id: 'mapbox.light',
                // attribution: 
            }).addTo(map);

            L.geoJson(statesData).addTo(map);


            function getColor(d) {
                return d > 1000 ? '#800026' :
                    d > 500 ? '#BD0026' :
                    d > 200 ? '#E31A1C' :
                    d > 100 ? '#FC4E2A' :
                    d > 50 ? '#FD8D3C' :
                    d > 20 ? '#FEB24C' :
                    d > 10 ? '#FED976' :
                    '#FFEDA0';
            }

            function style(feature) {
                return {
                    fillColor: getColor(feature.properties.density),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }

            L.geoJson(statesData, {
                style: style
            }).addTo(map);

            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });
                info.update(layer.feature.properties);

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
            }

            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                info.update();
            }

            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
            }

            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }

            geojson = L.geoJson(statesData, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);


            var info = L.control();

            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.update();
                return this._div;
            };

            // method that we will use to update the control based on feature properties passed
            info.update = function (props) {
                this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
                    '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' :
                    'Hover over a state');
            };

            info.addTo(map);

            var legend = L.control({
                position: 'bottomright'
            });

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }

                return div;
            };
    
    });

    legend.addTo(map);
        })