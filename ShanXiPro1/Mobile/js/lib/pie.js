var width = 300;
		var height = 300;
		var dataset = [ 30 , 10 , 43 , 55 , 13 ];
		
		var svg = d3.select("#pie")
					.append("svg")
					.attr("width", width)
					.attr("height", height);
		
		var pie = d3.layout.pie();

		var piedata = pie(dataset);
		
		var outerRadius = 100;	//外半径
		var innerRadius = 0;	//内半径，为0则中间没有空白

		var arc = d3.svg.arc()	//弧生成器
					.innerRadius(innerRadius)	//设置内半径
					.outerRadius(outerRadius);	//设置外半径
		
		var color = d3.scale.category10();
		
		var arcs = svg.selectAll("g")
					  .data(piedata)
					  .enter()
					  .append("g")
					  .attr("transform","translate("+ (width/2) +","+ (width/2) +")");
					  
		arcs.append("path")
			.attr("fill",function(d,i){
				return color(i);
			})
			.attr("d",function(d){
				return arc(d);
			});
		
		arcs.append("text")
			.attr("transform",function(d){
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor","middle")
			.text(function(d){
				return d.data;
			});
		