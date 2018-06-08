var init_latlon = [37.5642135,127.0016985];
var init_bounds = {"b":{"b":126.734086,"f":127.269311},"f":{"b": 37.413294, "f": 37.715133}};
$(document).ready(function(){
	get_data(init_bounds,15);
});
var hdata;
function get_data(bounds,cur_zoom){
	$.ajax({
		url:'/get_data',
		type:'post',
		data: {"bound":bounds,"zoom":cur_zoom},	
		success:function(result){
			hdata = result;
		},error:function(e){
			console.log(e.responseText);
		}
	});
}

var map = new google.maps.Map(d3.select("#map").node(), {
  zoom: 8,
  center: new google.maps.LatLng(init_latlon[0], init_latlon[1]),
  mapTypeId: google.maps.MapTypeId.roadmap
});

function get_color(count){
	if(count>300) return "#990000";
	else if(count>200) return "#d7301f";
	else if(count>100) return "#ef6548";
	else if(count>50) return "#fc8d59";
	else if(count>20) return "#fdbb84";
	else if(count>5) return "#fdd49e";
	else return "#fee8c8";
}

google.maps.event.addListener(map,'bounds_changed',function(){
	var bounds = map.getBounds();
	var bounds2 = {"b":{"b":bounds["b"]["b"],"f":bounds["b"]["f"]},"f":{"b":bounds["f"]["b"],"f":bounds["f"]["f"]}};
	var cur_zoom = map.getZoom();
	get_data(bounds2,cur_zoom);
});

var overlay = new google.maps.OverlayView();
	d3.selectAll(".circle").remove();
	  // Add the container when the overlay is added to the map.
	overlay.onAdd = function() {
		var layer = d3.select(this.getPanes().overlayLayer).append("div")
			.attr("class", "stations");

		// Draw each marker as a separate SVG element.
		// We could use a single SVG, but what size would it have?
		overlay.draw = function() {
		  var projection = this.getProjection(),
			  padding = 70;

		  var marker = layer.selectAll("svg")
			  .data(d3.entries(hdata))
			  .each(transform) // update existing markers
			.enter().append("svg")
			  .each(transform)
			  .attr("class", "marker");

		  // Add a circle.
		  marker.append("circle")
			  .attr("r", function(d){return (d.value['price']/3025)*70})
			  .attr("cx", padding)
			  .attr("cy", padding)
			  .style("fill",function(d){return get_color(d.value['count'])});

		  // Add a label.
		  marker.append("text")
			  .attr("x", padding-10)
			  .attr("y", padding)
			  .attr("dy", ".5em")
			  .text(function(d) { return Math.round(d.value['price']); });

		  function transform(d) {
			//console.log(d);
			d = new google.maps.LatLng(d.value['yaxis'], d.value['xaxis']);
			d = projection.fromLatLngToDivPixel(d);
			return d3.select(this)
				.style("left", (d.x - padding) + "px")
				.style("top", (d.y - padding) + "px");
		  }
		};
	  };

	  // Bind our overlay to the map…
	  overlay.setMap(map);
