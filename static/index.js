$(document).ready(function() {
    data = JSON.parse(data);
    $('#favlist').text(data['favorites']);
    draw_radar_chart(data['preferences']);
    console.log(data['tracks']);
});

function draw_radar_chart(pref) {
    //////////////////////////////////////////////////////////////
    //////////////////////// Set-Up //////////////////////////////
    //////////////////////////////////////////////////////////////
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = Math.min(600, window.innerWidth - 50) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    //////////////////////////////////////////////////////////////
    ////////////////////////// Data //////////////////////////////
    //////////////////////////////////////////////////////////////
//    var data = [
//              [//iPhone
//                {axis:"Battery Life",value:0.22},
//                {axis:"Brand",value:0.28},
//                {axis:"Contract Cost",value:0.29},
//                {axis:"Design And Quality",value:0.17},
//                {axis:"Have Internet Connectivity",value:0.22},
//                {axis:"Large Screen",value:0.02},
//                {axis:"Price Of Device",value:0.21},
//                {axis:"To Be A Smartphone",value:0.50}
//              ]
//            ];
    var data = [[]];
    var keys = Object.keys(pref);
    for (var i = 0; i < keys.length; i++) {
        data[0].push({
            axis: keys[i],
            value: pref[keys[i]]
        });
    }

    //////////////////////////////////////////////////////////////
    //////////////////// Draw the Chart //////////////////////////
    //////////////////////////////////////////////////////////////
    var color = d3.scale.ordinal()
        .range(["#EDC951","#CC333F","#00A0B0"]);

    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    };
    //Call function to draw the Radar chart
    RadarChart(".preferences", data, radarChartOptions);
}