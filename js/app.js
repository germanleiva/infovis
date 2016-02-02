// var format = d3.time.format("%d-%m-%Y (%H:%M h)");
function load(data){
    /*data = [
    {
        "sha": "a3f51f7f3a00bc17f10e59546977a9c0b40697a5",
        "nbModif": 13,
        "date": "2011-02-23T06:18:33Z",
        "ts": 1298441913,
        "user": "addyosmani",
        "project": "addyosmani/backbonejs-gallery"
    },
    {
        "sha": "4c9a2954d1d9769d7a70d1e5646509ee4ef39bd2",
        "nbModif": 3,
        "date": "2011-02-14T05:21:18Z",
        "ts": 1297660878,
        "user": "addyosmani",
        "project": "addyosmani/backbonejs-gallery"
    }];*/
    //console.log(dataB);


//d3.json("./data/data.json",function(data){
    // 2014-12-30T10:27:10Z
    var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
    /*
    D3.js setup code
    */
    
    data.forEach(function(each){
       each.date = format.parse(each.date) 
    });
    
    "use strict";
    var margin = 180,
        width = 1400 - margin,
        height = 600 - margin;

    var radius = 3,
        multiplier = 2;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin)
        .append('g')
        .attr('class', 'chart');

    d3.select('svg')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")

    var time_extent = d3.extent(data, function(d) {
        return d.date
    });
    
    console.log("TIME EXTEND:"+JSON.stringify(time_extent))

    var time_scale = d3.time.scale()
        .range([margin, width])
        .domain(time_extent);

    var count_extent = d3.extent(data, function(d) {
        return d['nbModif'];
    });

    var count_scale = d3.scale.linear()
        .range([2, 20])
        .domain(count_extent);
        
    var projectNames = d3.set(data.map(function(d){return d.project;}));
    
    //Workaround to transform the set into a simple array
    projectNames = projectNames.values(function(d){
        return d;
    });

    var project_scale = d3.scale.ordinal().range([height-20,margin]).domain(projectNames);

    var time_axis = d3.svg.axis()
        .scale(time_scale)
        .ticks(d3.time.months, 3);

    d3.select("svg")
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', "translate(0," + height + ")")
        .call(time_axis);

    var count_axis = d3.svg.axis()
        .scale(project_scale)
        .orient("left");
    
    d3.select("svg")
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', "translate(" + margin + ",0)")
        .call(count_axis);
       
    function updateCircles() {
        d3.selectAll('circle')
            .attr('cx', function(d) {
                return time_scale(d.date);
            })
            .attr('cy', function(d) {
                return project_scale(d.project);
            })
            .attr('r', function(d) {
                // if (d['home'] === d['team1'] || d['home'] === d['team2']) {
                    // return radius * multiplier;
                // } else {
                    return count_scale(d.nbModif)
                    // return radius;
                // }
            })
            .attr('fill', function(d) {
                var date = d.date
                if (date.getHours() > 8 && date.getHours() < 18) {
                    return 'yellow'
                }
                // if (d['home'] === d['team1'] || d['home'] === d['team2']) {
                    // return 'red'
                // } else {
                    return 'red';
                // }
            });
    }
    
     updateCircles();
        
    // var legend = svg.append("g")
    //     .attr("class", "legend")
    //     .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
    //     .selectAll("g")
    //     .data(["Home Team", "Others"])
    //     .enter().append("g");

    // legend.append("circle")
    //     .attr("cy", function(d, i) {
    //         return i * 30;
    //     })
    //     .attr("r", function(d) {
    //         if (d == "Home Team") {
    //             return radius * multiplier;
    //         } else {
    //             return radius;
    //         }
    //     })
    //     .attr("fill", function(d) {
    //         if (d == "Home Team") {
    //             return 'red';
    //         } else {
    //             return 'blue';
    //         }
    //     });

    // legend.append("text")
    //     .attr("y", function(d, i) {
    //         return i * 30 + 5;
    //     })
    //     .attr("x", radius * 5)
    //     .text(function(d) {
    //         return d;
    //     });
    $(function() {
        var dates = data.map(function(d){return d.date;}).sort(function(a,b){return a - b;});
        
        $("#slider" ).slider({
            range: true,
            min: 0,
            max: dates.length - 1,
            values: [0, dates.length - 1],
            slide: function( event, ui ) {
                var maxv = d3.min([ui.values[1], data.length]);
                var minv = d3.max([ui.values[0], 0]);;
                console.log("min "+minv)
                console.log("max "+maxv)
                // debugger;
                console.log("New time_scale domain: "+ JSON.stringify([dates[minv], dates[maxv-1]]))
                time_scale.domain([dates[minv], dates[maxv-1]]);
                
                d3.select("svg").transition().duration(750).select(".x.axis").call(time_axis);
                // debugger;
                // console.log(result)

                // graph.transition().duration(750)
                // .select(".path").attr("d", line(data));
                updateCircles()
            }
        });
    });
//});
}


