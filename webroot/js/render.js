//global vars
var pages = ["Home", "Walk Score", "Hospitals", "Parks", "Culture", "Jobs", "Schools", "Public Art", "Concerts", "Property", "Crime", "Food"];
var currentPage = pages[0];

//Render functions
function render_nav() {
   var ul = "<ul>";
   for (var i = 0; i < pages.length; i++) {
      ul += "<li class='left'>" + linkify(pages[i]) + "</li>";
   }
   ul += "</ul>";
   document.getElementById("nav").innerHTML = ul;
}

function render_page(name) {
   var str;
   currentPage = name;
   switch (name) {
      case "Home":
         render_tiles();
         return;
      case "Hospitals":
         str = getHospData(loc, true);
         break;
      case "Property":
         str = getNeighborhood(loc);
         break;
      case "Parks":
         getParks(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); });
         return;
      case "Culture":
         getCultureData(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); });
         return;
      case "Schools":
         getSchoolsData(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); },true);
         return;
      case "WalkScore":
         getWalkScoreData(loc, true);
         return;
      case "Jobs":
         getJobsData(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); });
         return;
      case "Concerts":
         getConcertData(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); });
         return;
      case "PublicArt":
         getPublicArtData(loc,
            function(success) { update_div("left-content", success);},
            function(error)   { update_div("left-content", error); },
            true);
         return;
      default:
         str = "Hey, now we're going to render " + name;
         break;
   }
   update_div("left-content", str);
}

function update_div(div, html) {
   document.getElementById(div).innerHTML = html;
}

function render_tiles() {
   //Initialize live tile data, if applicable
   getHospData(loc, false);
   getPublicArtSummary(loc);
   getCultureDataSummary(loc);
   var tiles = "<div style='display: flex; flex-wrap: wrap'>";
   for (var i = 1; i < pages.length; i++) {     //Start at 1 to skip 'Home' tile
      var tile = "", page = pages[i].replace(" ", "");
      tile += "<a href='#' onclick='render_page(\"" + page +"\"); return false;'>";
      tile += "<div class='tile " + page + "'><span class='" + get_icon(pages[i]) + "'></span>";
      tile += get_summary(pages[i]);
      tile += "</div></a>";
      tiles += tile;
   }
   tiles += "</div>";
   document.getElementById("left-content").innerHTML = tiles;
}

//Utility functions
function linkify(text) {
   text = text.replace(" ", "");
   return "<a href='#' onclick='render_page(text); return false;'>" + text + "</a>";
}

function get_summary(page) {
   var sum = "&nbsp;" + page + "<br/><ul id=\"" + page + "_tile\">";
   switch (page) {
      case "Hospitals":
         sum += get_hospital_summary();
         break;
      case "Walk Score":
         sum += getWalkScoreSummary(loc);
         break;
      case "Jobs":
         sum += '<li>Loading Data...</li>';
         getJobsSummary(loc, function(totalJobs, avgCompany) {
            var html = "<li>Fulltime Jobs: " + totalJobs + "</li>" +
               "<li>Avg Company: " + avgCompany + "</li>";
            document.getElementById("Jobs_tile").innerHTML = html;
         });
         break;
      case "Concerts":
         sum += getConcertSummary(loc);
         break;
      case "Public Art":
         sum += getPublicArtSummaryCount();
         break;
      case "Culture":
         sum += getCultureSummaryCount();
         break;
      case "Crime":
         sum += '<li>Loading Data...</li>';
         /*getCrimeSummary(loc,
          function(success) {$("div.tile.Crime ul").html(success);},
          function(error)   {$("div.tile.Crime ul").html(error); });*/
         break;
      default:
         sum += "<li>Pertinent Point</li>" +
            "<li>Salient Stat</li>";
         break;
   }
   return sum + "</ul>";
}

function get_icon(page) {
   var icon = "fa ";
   switch (page) {
      case "Hospitals":
         icon += "fa-ambulance fa-2x";
         break;
      case "Crime":
         icon += "fa-balance-scale fa-2x";
         break;
      case "Food":
         icon += "fa-yelp fa-2x";
         break;
      case "Walk Score":
         icon += "fa-map-o fa-2x";
         break;
      case "Parks":
         icon += "fa-tree fa-2x";
         break;
      case "Culture":
         icon += "fa-smile-o fa-2x";
         break;
      case "Property":
         icon += "fa-home fa-2x";
         break;
      case "Schools":
         icon += "fa-university fa-2x";
         break;
      case "Jobs":
         icon += "fa-money fa-2x";
         break;
      case "Concerts":
         icon += "fa-music fa-2x";
         break;
      default:
         icon += "fa-question-circle-o fa-5";
         break;
   }
   return icon;
}
