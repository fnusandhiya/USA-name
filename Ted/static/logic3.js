/*url = "/sqlite"
var newData;
d3.json(url).then(function(data) {
    newData = JSON.parse(data);
    //console.log(newData);
});*/

// Select the submit button
var submit = d3.select("#submit");

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();
  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#patient-form-input").property("value")
  //console.log(inputElement);
  d3.json('/search?name=' + inputElement).then(function(data) {
    var newData = JSON.parse(data);
    //console.log(newData);

      // Get the value property of the input element
  //var inputValue = inputElement.property("value");

  //console.log(people);
  let filteredData = newData
  filteredData = filteredData.filter(names => names.Name === inputElement);
  //console.log(filteredData)
  var names = filteredData.map(name => name.Name);
  if (inputElement in names === false){
      alert("Sorry!! We can not find your name....");
      return false;
  }
  // BONUS: Calculate summary statistics for the age field of the filtered data

  // First, create an array with just the age values
  var Occurrences = filteredData.map(names => names.Occurrence);
  var genders = filteredData.map(gender => gender.Gender);
  //console.log(genders);
  