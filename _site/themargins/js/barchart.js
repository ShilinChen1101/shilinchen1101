var data = [{"country":"Mexico","value":622743},
{"country":"El Salvador","value":28571},
{"country":"Guatemala","value":20000},
{"country":"Honduras","value":18385},
{"country":"Peru","value":9102},
{"country":"South Korea","value":7282},
{"country":"Brazil","value":7400},
{"country":"Ecuador","value":6725},
{"country":"Colombia","value":6608},
{"country":"Philippines","value":4674}
];


var svg = d3.select("#barchart"),
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

  	data.sort(function(a, b) { return a.value - b.value; });
    data.forEach(function(d){
      d.value = +d.value;
    })
  	x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.country; }));

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x)).ticks(5);
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d / 1000); }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        // .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.country); })
        .attr("width", function(d) { return x(d.value); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html("Country:"+ (d.country) + "<br>" + "DACA beneficiaries:" + (d.value));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
