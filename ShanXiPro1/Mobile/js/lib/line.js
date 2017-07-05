$('#chart2').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'ʵ������ 7������ͼ'
        },
        xAxis: {
            categories: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6','6/7']
        },
        yAxis: {
            title: {
                text: '����'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 2,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: '��λ',
            marker: {
                symbol: 'square'
            },
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2]
        }]
    });