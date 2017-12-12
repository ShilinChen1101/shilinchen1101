var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#mysvg").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform","translate(" + margin.left + "," + margin.top + ")");
var radius = 5
// parse the date / time
var parseTime = d3.timeParse("%Y");


// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
var yAxis = d3.axisLeft(y);
var parseTime = d3.timeParse("%Y");


d3.csv("ufodata2.csv", function(error,rawData){
  if(error) throw error;

  rawData = rawData.filter(function(d) {
    return d.datetime;
  });

  var data = d3.nest()
    .key(function(d) {
      return new Date(d.datetime).getFullYear();
    })
    .entries(rawData)
    .sort(function(a, b) {
      return parseInt(a.key) - parseInt(b.key);
    });


  var pointData = d3.nest()
     .key(function(d) {
       return d.long + "," + d.lat;
     })
     .entries(rawData);


     data.forEach(function(d) {
         d.year = parseTime(d.key);
         d.sightings = d.values.length;
     });


     // Scale the range of the data
     x.domain(d3.extent(data, function(d) { return d.year; }));
     y.domain(d3.extent(data, function(d) { return d.sightings; }));



     var valueline = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.sightings); });


     // Add the valueline path.
     svg.append("path")
         .datum(data)
         .attr("class", "line")
         .attr("d", valueline);




         var points = svg.selectAll(".MyCircle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class","MyCircle")
                .attr("transform","translate(0,0)")
                .attr("r", 10)
                .attr("cx", function(d){ return x(d.year); })
                .attr("cy", function(d){ return y(d.sightings); })
                .on("mouseover", function(){
                  d3.select(this)
                    .transition()
                    .duration(500)

                    .attr("r", 20);})
                .on("mouseout", function(){
                  d3.select(this).transition().duration(500).attr("r", 10);
                });

          var tips = svg.append("g").attr("class","tips");

          tips.append("rect")
            .attr("class", "tip-border")
            .attr("width", 200)
            .attr("height", 50)
            .attr('rx', 10)
            .attr('ry', 10);

          var wording1 = tips.append("text")
            .attr("class", "tips-text")
            .attr("x", 10)
            .attr("y", 20)
            .text("");

            var wording2 = tips.append("text")
              .attr("class", "tips-text")
              .attr("x", 10)
              .attr("y", 40)
              .text("");

              svg.on('mousemove', function() {
                  var m = d3.mouse(this),
                    cx = m[0];

                  var x0 = x.invert(cx);
                  var i = (d3.bisector(function(d) {
                    return d.year;
                  }).left)(data, x0, 1);
                  var d0 = data[i - 1],
                    d1 = data[i] || {},
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;

                  function formatWording(d) {
                    return 'Year：' + (d.year.getFullYear());
                  }
                  wording1.text(formatWording(d));
                  wording2.text('Sightings：' + d.sightings);

                  var x1 = x(d.year),
                    y1 = y(d.sightings);


                  var dx = x1 > width ? x1 - width + 200 : x1 + 200 > width ? 200 : 0;

                  var dy = y1 > height ? y1 - height + 50 : y1 + 50 > height ? 50 : 0;

                  x1 -= dx;
                  y1 -= dy;

                  d3.select('.tips')
                    .attr('transform', 'translate(' + x1 + ',' + y1 + ')');

                  d3.select('.tips').style('display', 'block');
                })
                .on('mouseout', function() {
                  d3.select('.tips').style('display', 'none');
                });




     // Add the X Axis
     svg.append("g")
        .attr("class","x axis")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(x));

     // Add the Y Axis
     svg.append("g")
        .attr("class","y axis")
         .call(d3.axisLeft(y))
         .append("text")
              .attr("transform", "rotate(0)")
              .attr("y", 25)
              .attr("x", 75)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("UFO sightings");




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
           .attr("r", 1.5)
           .attr("opacity", 0.5)
           .on("mousemove", function(d){
               tooltip
                 .style("left", d3.event.pageX - 50 + "px")
                 .style("top", d3.event.pageY - 70 + "px")
                 .style("display", "inline-block")
                 .html("State:"+ (d.year) + "<br>" + "DACA beneficiaries:" + (d.sightings));
           })
       		.on("mouseout", function(d){ tooltip.style("display", "none");})
           .attr("transform", function(d){
           return "translate(" + proj(d.key.split(",")) + ")";
         });





     });

});
