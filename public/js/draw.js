
var width = 1000,
    height = 800,
	circle_width = 80;

var color = d3.scale.category10();

var nodes = [],
    links = [],
	imgs = [];

var force = d3.layout.force()
.nodes(nodes)
.links(links)
.charge(-400)
.size([width, height])
.on("tick", tick);

force.linkDistance(function(link){
	return link.dis;
});

var svg = d3.select(".d3-container").append("svg")
.attr("width", width)
.attr("height", height);

var defs = svg.append('svg:defs');

var node = svg.selectAll(".node"),
link = svg.selectAll(".link");


setTimeout(function() {
	$.getJSON("./example.json",function(data){
		var first=null, i=0;
		$.each(data, function(key, val){
			++i;
		    var tmp = {id: val.id, img: val.img}; 
		
		    nodes.push(tmp);
			if(first===null) first=tmp;
			else
			    links.push({source: first, target: tmp, dis: val.dis});
		});
		start();
	});

}, 0);

function start() {
	for(n in nodes){
		var tmp = defs.append("svg:pattern")
						.attr("id", "image"+nodes[n].id)
						.attr("width", circle_width/4)
						.attr("height", circle_width/4)
						.attr("patternUnits", "objectBoundingBox")
						.append("svg:image")
						.attr("xlink:href", nodes[n].img)
						.attr("width", circle_width)
						.attr("height", circle_width)
						.attr("x",0)
						.attr("y",0);
		imgs.push(tmp);
	}

 link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
 link.enter().insert("line", ".node").attr("class", "link");
 link.exit().remove();

 node = node.data(force.nodes(), function(d) { return d.id;});
 node.enter().append("circle")
					.attr("class", function(d) { 
						return "node " + d.id; 
					})
					.attr("cx", circle_width/2)
					.attr("cy", circle_width/2)
					.attr("r", circle_width/2)
					.style("fill", "#fff")
					.style("fill", function(d) {
						return "url(#image" + d.id + ")";
					})
					.style("stroke", "black")
					.style("stroke-width", 0.25);
 node.exit().remove();

 force.start();
}

function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });
  }