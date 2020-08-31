 //import { ApparentWindSpeed } from "../other/util-browser";

window.onload = function () {
    
    var dps1 = [{x: 1, y: 0},];   //dataPoints. 
    var dps2 = [{x: 1, y: 0},];   //dataPoints.
    var dps3 = [{x: 1, y: 0},];   //dataPoints.
    var dps4 = [{x: 1, y: 0},];   //dataPoints.
    var dps5 = [{x: 1, y: 0},];   //dataPoints.
    var dps6 = [{x: 1, y: 0},];   //dataPoints.
    
    
	var chart1 = new CanvasJS.Chart("chartContainer1",
    {
        animationEnabled: true,
        title: {
            text: "Apparent Wind Speed"
        },
        axisX: {
            interval: 1,
            maximum: 70,
            intervalType: "second"
        },
        axisY: {
            interval: 10,
            maximum: 70,
        },
        data: [
        {
            type: "line",
            color: "rgba(255,52,52,1)",
            dataPoints: dps1
        },
        ]
    });
chart1.render();

var chart2 = new CanvasJS.Chart("chartContainer2",
{
        animationEnabled: true,
        title: {
            text: "Velocity"
        },
        axisX: {
            interval: 1,
            intervalType: "second"
        },
        axisY: {
            includeZero: false
        },
        data: [
        {
          type: "line",
          color:"rgba(52, 204, 235,1)",
          dataPoints: dps2
        }
        ]
    });

chart2.render();


var chart3 = new CanvasJS.Chart("chartContainer3",
    {
        animationEnabled: true,
        title: {
            text: "Thrust"
        },
        axisX: {
            interval: 1,
            intervalType: "second"
        },
        axisY: {
            includeZero: false
        },
        data: [
        {
          type: "line",
          color:"rgba(50,128,0,1)",
          dataPoints: dps5
        }
        ]
    });
chart3.render();

var chart4 = new CanvasJS.Chart("chartContainer4",
{
        animationEnabled: true,
        title: {
            text: "Alfa Left Wing Chart"
        },
        axisX: {
            interval: 1,
            intervalType: "second"
        },
        axisY: {
            includeZero: false
        },
        data: [
        {
          type: "line",
          color:"rgba(255,69,0,1)",
          dataPoints: dps3
        }
        ]
    });
chart4.render();


var chart5 = new CanvasJS.Chart("chartContainer5",
    {
        animationEnabled: true,
        title: {
            text: "Alfa Vertical Chart"
        },
        axisX: {
            interval: 1,
            intervalType: "second"
        },
        axisY: {
            includeZero: false
        },
        data: [
        {
          type: "line",
          color:"rgba(75,0,130,1)",
          dataPoints: dps4
        }
        ]
    });
chart5.render();

var chart6 = new CanvasJS.Chart("chartContainer6",
    {
        animationEnabled: true,
        title: {
            text: "Rudder Chart"
        },
        axisX: {
            
            interval: 1,
            intervalType: "second",
            
        },
        axisY: {
            includeZero: false
        },
        data: [
        {
          type: "line",
          color:"rgba(255,255,0,1)",
          dataPoints: dps6
        }
        ]
    });
chart6.render();

var xVal = dps1.length + 1;


var updateInterval = 100;

var updateChart = function () {
    

    dps1.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps1")))});

    dps2.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps2")))});

    dps3.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps3")))});

    dps4.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps4")))});

    dps5.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps5")))});

    dps6.push({x: xVal,y:parseInt(JSON.parse(window.localStorage.getItem("dps6")))});
    
    xVal++;

    chart1.render();

    chart2.render();

    chart3.render();

    chart4.render();

    chart5.render();

    chart6.render();
// update chart after specified time. 

};

setInterval(function(){updateChart()}, updateInterval); 

}

window.onclose = function () {
    window.localStorage.clear();
}
