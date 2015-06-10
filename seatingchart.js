var width = 1040,
    height = 500,
    active = d3.select(null),
    lastDept = null;

var seatsJson = "https://confluence.knewton.net/download/attachments/71598121/seats.json";
var seats7 = "https://confluence.knewton.net/download/attachments/71598121/seats7.json";

drawSeatingChart(seatsJson);
drawSeatingChart(seats7);


function drawSeatingChart(jsonFile) {
  var svg = d3.select("#seatingChart").append("svg")
                                      .attr("width", width)
                                      .attr("height", height);

  d3.select("#seatingChart").append('br').attr("style", "clear: left;");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='color:red'>" + d.employee + "</span></br>" + d.dept;
    })
   
  svg.call(tip);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", reset);

  var borderPath = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", height)
  .attr("width", width)
  .style("stroke", "#ccc")
  .style("fill", "none")
  .style("stroke-width", 1);

  var g = svg.append("g")
      .style("stroke-width", "1.5px");

  var path = d3.geo.path();

  d3.json(jsonFile, function(error, data) {
    var gg = g.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) { return "translate("+ d.x_axis + "," + d.y_axis + ")"; })
      .attr("align", "center")
      .attr("class", function(d) { return d.dept; })
      .on("click", clicked)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);    

    gg.append("rect")
      // .attr("x", function (d) { return d.x_axis; })
      // .attr("y", function (d) { return d.y_axis; })
      .attr("height", function (d) { return d.height; })
      .attr("width", function (d) { return d.width; })
      .attr("id", function(d) { return d.employee.split(" ").join("-"); })
      .attr("class", "feature");
      // .style("fill", function (d) { getDeptColor()} );
      

    gg.append("text")
      .attr("x", function(d) {return d.width / 2; })
      .attr("y", function(d) { return d.height / 2 + 5; })
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("cursor", "pointer")
      .attr("style", "font-size: 10px")
      .text(function(d) { 
        
        if (!d.employee) {
          console.log("here");
          return "";
        }
        else if (d.employee.indexOf(" ") > -1) {
          var name = d.employee.split(" ")
          var first_name = name[0];
          var last_name = name[1];
          return first_name.charAt(0) + last_name.charAt(0); 
        } else {
          return d.employee[0];
        }

      });

    // var deptList = data.map(function(d) {return d.dept;});
    // var depts = [""]

    // for (var i in deptList) {
    //   if (depts.indexOf(deptList[i]) < 0) {
    //     depts.push(deptList[i]);
    //   }
    // }
    // console.log(depts);
    // var select = d3.select("body")
    //   .append("div")
    //   .append("p")
    //     .text("Department: ")
    //   .append("select")
    //   .on("change", function() {
    //     var minX = Number.POSITIVE_INFINITY,
    //         maxX = Number.NEGATIVE_INFINITY,
    //         minY = Number.POSITIVE_INFINITY,
    //         maxY = Number.NEGATIVE_INFINITY;
        
    //     d3.selectAll("." + lastDept).select("rect").classed("active", false);
    //     if (this.value == "") {
    //       lastDept = null;
    //       reset();
    //     }

    //     d3.selectAll("." + this.value).select("rect").classed("active", true);
    //     d3.selectAll("." + this.value).select("rect").each( function(d) {
    //       minX = Math.min(d.x_axis, minX);
    //       maxX = Math.max(d.x_axis + d.width, maxX);
    //       minY = Math.min(d.y_axis, minY);
    //       maxY = Math.max(d.y_axis + d.height, maxY);
    //     });
    //     lastDept = this.value;

    //     dWidth = maxX - minX;
    //     dHeight = maxY - minY;

    //     console.log(dWidth);
    //     console.log(dHeight);
    //     console.log(minX);
    //     console.log(minY);

    //     zoom(dWidth, dHeight, minX, minY, width, height);

    //   });

    // select.selectAll("option")
    //     .data(depts)
    //     .enter().append("option")
    //     .attr("value", function(d) { return d; })
    //     .text(function(d) { return d; });


    });

  function getSeatingFrame(rectElement) {
    return d3.select(rectElement.node().parentElement.parentElement)
  }


  function clicked(d) {
    var dis = d3.select(this).select("rect");
    if (active.node() === dis.node()) return reset();
    active.classed("active", false);

    if (lastDept != null) {
      d3.selectAll("." + lastDept).select("rect").classed("active", false);
    }
    

    active = dis.classed("active", true);   

    loadProfile(d.employee);
    
    zoom(g, d.width, d.height, d.x_axis, d.y_axis, width, height);
  }

  function zoom(frame, dwidth, dheight, x_axis, y_axis, width, height) {
    var dx = dwidth,
        dy = dheight,
        x = x_axis + dwidth / 2,
        y = y_axis + dheight / 2

    var scale = .5 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    frame.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

  }

  function reset() {
    if (lastDept != null) {
      d3.selectAll("." + lastDept).select("rect").classed("active", false);
    }
    d3.select("#profile").select("iframe").remove();
    active.classed("active", false);
    active = d3.select(null);

    g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
  }

      //Call back for when user selects an option
    function onSelect(d) {
      active.classed("active", false);
      
      var id = "#" + d.employee.split(" ").join("-");
      console.log(d3.select(id));
      active = d3.select(id).classed("active", true);
      frame = getSeatingFrame(d3.select(id))

      loadProfile(d.employee);

      zoom(frame, d.width, d.height, d.x_axis, d.y_axis, width, height);
    }

    function loadProfile(employeeName) {
      src = "https://employee-list2.appspot.com/el/?action=view&user=" + employeeName.split(" ")[0];
      d3.select("#profile").select("iframe").remove();
      d3.select("#profile").append("iframe").attr("src", src).attr("style","width: 400px; height: 1000px;");
    }


    // create keys for search bar
    var keys = [];

    d3.json(seatsJson, function(error, data) {
        for (var i = 0; i < data.length; i++) {
            keys.push(data[i]);
        }
        console.log(keys);
        start();
    });

    d3.json(seats7, function(error, data) {
        for (var i = 0; i < data.length; i++) {
            keys.push(data[i]);
        }
        console.log(keys);
        start();
    });





    //Setup and render the autocomplete
    function start() {
        var mc = autocomplete("#searchBar")
                .keys(keys)
                .dataField("employee")
                .placeHolder("Search Employee - Start typing here")
                .width(960)
                .height(250)
                .onSelected(onSelect)
                .render();
    }

}



