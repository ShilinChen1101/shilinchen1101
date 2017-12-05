data = [
{"age":"0","value":4.5},
{"age":"1","value":7.6},
{"age":"2","value":8.3},
{"age":"3","value":9.7},
{"age":"4","value":8.0},
{"age":"5","value":8.7},
{"age":"6","value":7.4},
{"age":"7","value":7.4},
{"age":"8","value":6.5},
{"age":"9","value":6.2},
{"age":"10","value":5.6},
{"age":"11","value":5.0},
{"age":"12","value":3.9},
{"age":"13","value":3.5},
{"age":"14","value":4.1},
{"age":"15","value":3.7}
];


var svg = d3.select("#bar"),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]).padding(0.1);

var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("conutrydata.csv", function(error, data) {
//   	if (error) throw error;


    data.forEach(function(d){
      d.value = +d.value;
    })
  	x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.age; }));

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return d + "%"; }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        // .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.age); })
        .attr("width", function(d) { return x(d.value); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("age:"+ (d.age) + "<br>" + "DACA beneficiaries:" + (d.value) + "%");
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
