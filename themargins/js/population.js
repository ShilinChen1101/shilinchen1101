// SET UP DIMENSIONS
var w = 500,
    h = 300;

// margin.middle is distance from center line to each y-axis
var margin = {
top: 20,
right: 20,
bottom: 24,
left: 20,
middle: 25
};

// the width of each side of the chart
var regionWidth = w/2 - margin.middle;



// these are the x-coordinates of the y-axes
var pointA = regionWidth,
  pointB = w - regionWidth;

  // CREATE SVG
  var svg = d3.select('#svg1').append('svg')
  .attr('width', margin.left + w + margin.right)
  .attr('height', margin.top + h + margin.bottom)
  // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
  .append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("request accepted.csv", function(error,data){
  if(error) throw error;

  data.forEach(function(d){
    d.female = +d.female;
    d.male = +d.male;
    d.total = +d.total;
    d.percentfemale = +d.percentfemale;
    d.percentmale = +d.percentmale;

  });






// find the maximum data value on either side
//  since this will be shared by both of the x-axes
var maxValue = Math.max(
d3.max(data, function(d) { return d.percentmale; }),
d3.max(data, function(d) { return d.percentfemale; })
);

// SET UP SCALES

// the xScale goes from 0 to the width of a region
//  it will be reversed for the left x-axis
var xScale = d3.scaleLinear()
.domain([0, maxValue])
.range([0, regionWidth])
.nice();

var xScaleLeft = d3.scaleLinear()
.domain([0, maxValue])
.range([regionWidth, 0]);

var xScaleRight = d3.scaleLinear()
.domain([0, maxValue])
.range([0, regionWidth]);

var yScale = d3.scaleBand()
.domain(data.map(function(d) { return d.group; }))
.rangeRound([h,0])
.padding(0.1);


// SET UP AXES
var yAxisLeft = d3.axisRight(yScale)
.tickSize(4,0)
.tickPadding(margin.middle-4);

var yAxisRight = d3.axisLeft(yScale)
.tickSize(4,0)
.tickFormat('');

var xAxisRight = d3.axisBottom(xScale)
.tickFormat(function(d) { return d + "%"; })
.ticks(5);


var xAxisLeft = d3.axisBottom(xScale.copy().range([pointA, 0]))
// REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANG
.tickFormat(function(d) { return d + "%"; })
.ticks(5);

// MAKE GROUPS FOR EACH SIDE OF CHART
// scale(-1,1) is used to reverse the left side so the bars grow left instead of right
var leftBarGroup = svg.append('g')
.attr('transform', translation(pointA, 0) + 'scale(-1,1)');
var rightBarGroup = svg.append('g')
.attr('transform', translation(pointB, 0));

// DRAW AXES
svg.append('g')
.attr('class', 'axis y left')
.attr('transform', translation(pointA, 0))
.call(yAxisLeft)
.selectAll('text')
.style('text-anchor', 'middle');

svg.append('g')
.attr('class', 'axis y right')
.attr('transform', translation(pointB, 0))
.call(yAxisRight)
// .style("text-anchor", "end")
// .text("Female");

svg.append('g')
.attr('class', 'axis x left')
.attr('transform', translation(0, h))
.call(xAxisLeft);

svg.append('g')
.attr('class', 'axis x right')
.attr('transform', translation(pointB, h))
.call(xAxisRight);




// DRAW BARS
leftBarGroup.selectAll('.bar.left')
.data(data)
.enter().append('rect')
  .attr('class', 'bar left')
  .attr('x', 0)
  .attr('y', function(d) { return yScale(d.group); })
  .attr('width', function(d) { return xScale(d.percentmale); })
  .attr('height', yScale.bandwidth());



rightBarGroup.selectAll('.bar.right')
.data(data)
.enter().append('rect')
  .attr('class', 'bar right')
  .attr('x', 0)
  .attr('y', function(d) { return yScale(d.group); })
  .attr('width', function(d) { return xScale(d.percentfemale); })
  .attr('height', yScale.bandwidth());

  // draw tips
  // var tooltip = d3.select("body")
  // 							.append("div")
  // 							.attr("class","tooltip")
  // 							.style("opacity",0.0);
  //
  //         leftBarGroup.on("mouseover",function(d){
  // 				/*
  // 				鼠标移入时，
  // 				（1）通过 selection.html() 来更改提示框的文字
  // 				（2）通过更改样式 left 和 top 来设定提示框的位置
  // 				（3）设定提示框的透明度为1.0（完全不透明）
  // 				*/
  //
  //
  // 				tooltip.html( "的出货量为" + "<br />" + d.percentfemale + " 百万台")
  // 					.style("left", (d3.event.pageX) + "px")
  // 					.style("top", (d3.event.pageY + 20) + "px")
  // 					.style("opacity",1.0);
  //
  //           console.log(d);
  // 			})
  // 			.on("mousemove",function(d){
  // 				/* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
  //
  // 				tooltip.style("left", (d3.event.pageX) + "px")
  // 						.style("top", (d3.event.pageY + 20) + "px");
  // 			})
  // 			.on("mouseout",function(d){
  // 				/* 鼠标移出时，将透明度设定为0.0（完全透明）*/
  //
  // 				tooltip.style("opacity",0.0);
  //       });


// so sick of string concatenation for translations
function translation(x,y) {
return 'translate(' + x + ',' + y + ')';
}

});

function updateData(){
  d3.csv("approved.csv", function(error,data) {
    data.forEach(function(d){
      d.female = +d.female;
      d.male = +d.male;
      d.total = +d.total;
      d.percentfemale = +d.percentfemale;
      d.percentmale = +d.percentmale;
    });
    var maxValue = Math.max(
    d3.max(data, function(d) { return d.percentmale; }),
    d3.max(data, function(d) { return d.percentfemale; })
    );

    // SET UP SCALES

    // the xScale goes from 0 to the width of a region
    //  it will be reversed for the left x-axis
    var xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth])
    .nice();

    var xScaleLeft = d3.scaleLinear()
    .domain([0, maxValue])
    .range([regionWidth, 0]);

    var xScaleRight = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, regionWidth]);

    var yScale = d3.scaleBand()
    .domain(data.map(function(d) { return d.group; }))
    .rangeRound([h,0])
    .padding(0.1);

    // Select the section we want to apply our changes to
    var svg = d3.select("#svg1").transition();

    // Make the changes
        svg.select(".bar.left")   // change the line
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar left')
          .attr('x', 0)
          .attr('y', function(d) { return yScale(d.group); })
          .attr('width', function(d) { return xScale(d.percentmale); })
          .attr('height', yScale.bandwidth());

          svg.select(".bar.right")   // change the line
          .data(data)
          .enter().append('rect')
            .attr('class', 'bar right')
            .attr('x', 0)
            .attr('y', function(d) { return yScale(d.group); })
            .attr('width', function(d) { return xScale(d.percentfemale); })
            .attr('height', yScale.bandwidth());
        svg.select(".axis.y.left") // change the x axis
            .duration(750)
            .call(yAxisLeft);
        svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);

  });
}
