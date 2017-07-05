function DrawLine(ele,backgroundvolor,dt,name,area){
    var dat = [];
    for(var i=0;i<7;i++)
	{
		var dd = new Date();
		dd.setDate(dd.getDate()-i);//获取AddDayCount天后的日期
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
		dat.push(m+"/"+d);
		
	}
	$('#'+ele).highcharts({
        chart: {
			backgroundColor: backgroundvolor,
            type: 'spline'
			
        },
		credits:false,
        title: {
            text: name
        },
        xAxis: {
            categories: dat.reverse(),
			
			gridLineColor:"#C7C7C7",
			lineColor:"#C7C7C7"
        },
        yAxis: {
            title: {
                text: '人数'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
			gridLineColor:"#C7C7C7",
			lineColor:"#C7C7C7",
			//tickPixelInterval:10
			tickInterval:5
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#F0FFF0',
                    lineWidth: 1
                }
            }
			
        },
        series: [{
            name: area,
           data: dt
        }]
    });	
}

function Draw3DPie(ele,dt)
{
    console.log("开始画饼图");
	$('#'+ele).highcharts({
		legend: {
			
            labelFormat: '<span style="{color}">{name}:{y}</span>'
        },
		colors:[
                    '#FF4500',//红FF4500
                    '#228B22',//绿
                    '#33FFDD',//蓝
                    '#FF8888'//黄FF8888
                  ],
        chart: {
            type: 'pie',
			backgroundColor: 'rgba(0,0,0,0)',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
		credits:false,
        title: {
            text: ""
        },
		 plotArea: {
         shadow: null,
         borderWidth: null,
         backgroundColor: null
      },
        tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.0f}%</b>'
        },
        plotOptions: {
            pie: {
                size:'70%',
                borderWidth: 0,
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 30,
				showInLegend: false,
                dataLabels: {
                    enabled: true,
					distance:5,
					style: {
                       backgroundColor: '#DDDDDD'
                    },
                    formatter: function(){
						if(this.percentage>0)
						{
							return this.percentage.toFixed(0)+"%"
						}
						
					}
                }
            }
        },
        series: [{
            type: 'pie',
            name: '占比',
            data: dt
        }]
    });
	
	
}