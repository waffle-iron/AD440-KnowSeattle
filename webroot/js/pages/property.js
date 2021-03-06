/* This function is used when an address is not provided by the user
  and will instead use the latitude and longitude from the device position.
  It will provide the neighborhood ID and name from the Zillow database.
  Author: Austin Amort */

var eyes = require('eyes');
var http = require('http');
var https = require('https');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
// sample values for location, replace this with the global variable from Jeremy

function getNeighborhood(loc) {
  // Connect to the db
   var long = loc.lng, lat = loc.lat;
   MongoClient.connect("mongodb://localhost:27017/knowSeattle", function (err, db) {
       db.collection('neighborhoods', function (err, collection) {
           var query = { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: [ long, lat ] } } } }
           collection.findOne(query, [], function(err, document) {
             if(err) {
               throw err;
             }
             console.log(document.properties.REGIONID);
           })

       });

   });
}

function gethousingprices(street, documentid) {
   var newstreet = street.replace(/ /g, '+');

   var options = {
      host: 'www.zillow.com',
      port: 80,
      path: '/webservice/GetSearchResults.htm?zws-id=X1-ZWz19eifb82423_85kuc&address=' + newstreet + '&citystatezip=Seattle%2C+WA',
      method: 'GET'
   };

   var data = "", price = "";

   http.get(options, function(res) {
      res.on('data', function(dataresponse) { data += dataresponse.toString(); });
      res.on('end', function() {
         //console.log('data', data);
         //parser.parseString(data, function(err, result) {
         //	console.log('FINISHED', err, result);
         //});

         var neighborhood =(data.split("<region name=\"")[1]).split("\" id=")[0];

         price = (data.split("<zindexValue>")[1]).split("</zindexValue>")[0];
         //console.log("The housing costs for the " + neighborhood + " neighborhood is: " + price);
         document.getElementById(documentid).innerHTML = ("The housing costs for the " + neighborhood + " neighborhood is: " + price);
         //return price;
      });
   }).on('error', function(e) {
      console.log("Got error: " + e.message);
   });
}
