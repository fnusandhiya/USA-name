var AccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

/*

*/
// url = "/nameply"
// var newData;
// d3.json(url).then(function(data) {
//     newData = JSON.parse(data);
// });

// I ran out of time, this section should be used to repaint the map between entering names
//if the SVG area isn't empty when the browser loads, remove it
// and replace it with a resized version of the chart
//
// var mapArea = d3.select("body").select("map");
//    if (!mapArea.empty()) {
//    mapArea.remove();
// }

// Select the submit button
var submit = d3.select("#submit");
submit.on("click", function () {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#searchBox").property("value")
    

    //console.log(inputElement);
    d3.json('/my/' + inputElement).then(function (data) {
        newData = JSON.parse(data);
        console.log(newData);

        //Get the value property of the input element
        //var inputValue = inputElement.property("value");

        //console.log(people);
        let filteredData = newData
        filteredData = filteredData.filter(names => names.Name === inputElement);

        var names = filteredData.map(name => name.Name);
        if (filteredData.length === 0) {
            alert("Sorry!! We can not find that name....");
            d3.select(".submit").remove();

        };

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + AccessToken, {
            id: 'mapbox.light',
            // attribution: 
        }).addTo(map);

        // control that shows state info on hover
        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };

        info.update = function (props) {
            this._div.innerHTML = '<h4>USA Name by State Density</h4>' + (props ?
                '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>' :
                'Hover over a state');
        };

        info.addTo(map);


        // get color depending on population density value
        function getColor(d) {
            return d > 110000 ? '#800026' :
                d > 80000 ? '#BD0026' :
                d > 65000 ? '#E31A1C' :
                d > 15000 ? '#FC4E2A' :
                d > 5000 ? '#FD8D3C' :
                d > 2000 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                '#FFEDA0';
        }

        function style(feature) {
           // console.log(data);
            function getNameCount(State){
                for (var i=0; i< newData.length; i++){
                    if (State == newData[i].State){
                        return newData[i].sum_1
                    }
                }
                
            }
            
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(getNameCount(feature.properties.name))
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            info.update(layer.feature.properties);
        }

        var geojson;

        // Step 1: Initialize tool tip
        // // ==============================
        // var toolTip = d3.tip()
        // .attr("class", "tooltip")
        // .offset([80, -60])
        // .html(function(d) {
        // return (`Name ${newData.Name}<br>State ${newData.State}<br>Occurrences ${newData.sum_1}`);
        // });

        // // Step 2: Create tooltip in the chart
        // // ==============================
        // TipGroup.call(toolTip);

        // // Step 3: Create event listeners to display and hide the tooltip
        // // ==============================
        // TipGroup.on("click", function(data) {
        //     toolTip.show(data, this);
        // })
        //     // onmouseout event
        //     .on("mouseout", function(data, index) {
        //     toolTip.hide(data);
        //     });
        // ==============================
        //
        // OR: Attempt 2
        // var tip = d3.tip()
        //     .attr('class', 'd3-tip')
        //     .offset([-10, 0])
        //     .html(function(d) {
        //         return "<strong>Name occurrence:</strong> <span style='color:red'>" + newData.sum_1 + "</span>"
        // ;})

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

        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


        var legend = L.control({
            position: 'bottomright'
        });

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 2000, 5000, 15000, 65000, 80000, 110000],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };
    legend.addTo(map);

    });
})