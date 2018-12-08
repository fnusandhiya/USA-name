$(document).ready(function() {
    $('#example').DataTable( {
        "ajax": {url:"/table", dataSrc: ""},
        "processing": true,
        "columns": [
            { "data": "Abbr" },
            { "data": "Gender" },
            { "data": "Year" },
            { "data": "Name" },
            { "data": "Occurrence" },
            { "data": "State" },
            { "data": "Lat" },
            { "data": "Lon"}
          ]
    } );
});