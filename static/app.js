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
  console.log(filteredData.length)
  var names = filteredData.map(name => name.Name);
  if (filteredData.length === 0){
      alert("Sorry!! We can not find your name....");
      d3.select(".summary li").remove();
      d3.select("#gender_image").attr("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS_cHfgCqedy8_NnNX_JCGY2zeblYNzKtG1vgcSx10NNGJN7mEGA");
      return false;
  }
  // BONUS: Calculate summary statistics for the age field of the filtered data

  // First, create an array with just the age values
  var Occurrences = filteredData.map(names => names.Occurrence);
  var genders = filteredData.map(gender => gender.Gender);
  //console.log(genders);
  

  if (genders[0]==="F"){
      alert("Yay!! Its a girl's name...");
      var image = "/static/1457d79ae7aeb25.jpg"
  }else {
      alert("Oh, sounds more like a boy's name though...");
      var image = "/static/5b6f65b04f21b3590172f8ce6dba33e6.jpg"
  }

  d3.select("#gender_image").attr("src", image);
  // Next, use math.js to calculate the mean, median, mode, var, and std of the ages
  var mean = math.round(math.mean(Occurrences));
  var median = math.median(Occurrences);
  var mode = math.mode(Occurrences);
  /*var variance = math.round(math.var(Occurrences));
  var standardDeviation = math.round(math.std(Occurrences));*/

  // Finally, add the summary stats to the `ul` tag
  d3.select(".summary li").remove();
  d3.select(".summary")
    .append("li").text(`Mean: ${mean}`)
    .append("li").text(`Median: ${median}`)
    .append("li").text(`Mode: ${mode}`)
    /*.append("li").text(`Variance: ${variance}`)
    .append("li").text(`Standard Deviation: ${standardDeviation}`);*/

  //console.log(filteredData);
  });


});