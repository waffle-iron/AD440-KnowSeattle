/*
Client side script to call the property API
Author: Austin Amort
*/

function getPropertySummary() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      return this.responseText;
    }
  };
  console.log("lat: " + loc.lat);
  console.log("long: " + loc.lng);
  var url = "property/summary?lat=" + loc.lat + "&long=" + loc.lng;
  xhttp.open("GET", "/property/summary/", true);
  xhttp.send();
}