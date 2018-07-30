var parseTime = d3.timeParse("%Y");
var titleText = "UFO Sightings in"

d3.csv("ufodata2.csv", function(error,rawData){
  if(error) throw error;

  // rawData = rawData.filter(function(d) {
  //   return d.datetime;
  // });
  //
  // var data = d3.nest()
  //   .key(function(d) {
  //     return new Date(d.datetime).getFullYear();
  //   })
  //   .entries(rawData)
  //   .sort(function(a, b) {
  //     return parseInt(a.key) - parseInt(b.key);
  //   });


  var pointData = d3.nest()
     .key(function(d) {
       return d.long + "," + d.lat;
     })
     .entries(rawData);

    pointData.sort(function(a, b) { return a.value - b.value; });
    pointData.forEach(function(d) {
        d.year = parseTime(d.key);
        d.radius = d.values.length;
    });
    var r = d3.scaleSqrt().domain([0,500]).range([0,20]);


  var inputValue = null;
  var time = ["2005","2006","2007","2008","2009","2010","2011","2012","2013","2014"];

     d3.json("usa.json", function(error, data) {
     var geoJSON = topojson.feature(data, data.objects.states);
     console.log(geoJSON);
     console.log(data);
     var proj = d3.geoAlbersUsa()
       .fitSize([window.innerWidth, window.innerHeight], geoJSON);
     var path = d3.geoPath()
       .projection(proj);
     var svg = d3.select("#map")
       .attr("width", window.innerWidth)
       .attr("height", window.innerHeight);
     var states = svg.selectAll("path")
       .data(geoJSON.features);

       states.enter().append("path")
       .attr("d", function(d) {
             return path(d);
         })

       var svg = d3.select("#map")
       .attr("width", window.innerWidth)
       .attr("height", window.innerHeight);
       var groups = svg.append("g");
       var proj = d3.geoAlbersUsa()
         .fitSize([window.innerWidth, window.innerHeight], geoJSON);
       var path = d3.geoPath()
         .projection(proj);




       var points = svg.selectAll("circle")
         .data(pointData);

       points.enter().append("circle")
           .attr("r", function(d){ return r(d.radius) })
           .attr("opacity", 0.5)
           .attr("transform", function(d){
           return "translate(" + proj(d.key.split(",")) + ")";
         });

      d3.select("#timeslide").on("input", function() {
           update(+this.value);
       });
       function update(value) {
           document.getElementById("range").innerHTML=time[value];
           inputValue = time[value];
           d3.selectAll("path")
               .style("fill", timeMatch);
       }

       function timeMatch(rawData) {
         var d = new Date(d.datetime);
         var y = time[d.getFullYear()]
         if (inputValue == data) {

             if (time == "2005") {
                 this.parentElement.appendChild(this);
                 return 'red'
             } else {
                 return '#999'
             }
         }
        //  else if (inputValue == "2004") {
        //      if (data.properties.elect2004 == "D") {
        //          return '#084594'
        //      } else {
        //          return '#cb181d'
        //      }
        //  } else if (inputValue == "2008") {
        //      if (data.properties.elect2008 == "D") {
        //          return '#084594'
        //      } else {
        //          return '#cb181d'
        //      }
        //  } else if (inputValue == "2012") {
        //      if (data.properties.elect2012 == "D") {
        //          return '#084594'
        //      } else {
        //          return '#cb181d'
        //      }
        //  } else if (inputValue == "2016") {
        //      if (data.properties.elect2016 == "D") {
        //          return '#084594'
        //      } else {
        //          return '#cb181d'
        //      }
        //  };
     }


     });

});
