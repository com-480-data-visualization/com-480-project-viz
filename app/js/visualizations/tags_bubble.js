(function() {
    const selector = "#circ_pack"
    const width = $(selector).width()
    const height = $(selector).height()

    var svg = d3.select(selector)
        .attr("width", width)
        .attr("height", height)

    // create the tooltip
    var Tooltip = d3.select("#circ_pack_container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "4px")
        .style("padding", "10px")
        .style("width", "320px")
        .style("height", "85px")

    // Read data
    d3.csv("data/tags.csv", function(data) {
        data = data.filter((d) => d.count > 1000)

        // Color palette
        var colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

        // Scale size according to highest seen value in the dataset
        var size = d3.scaleLinear()
            .domain([0, 5031])
            .range([5,60])

        // Mouseover functions //
        var mouseover = function(d) {
            Tooltip.style("opacity", 1)
        }

        var mousemove = function(d) {
            console.log(d);
            Tooltip
                .html("Tag: <b>" + d.tags + "</b><br>Category: <b>" + d.category + "</b><br># apparences in the category: <b>" + d.count + "</b>")
                .style("left", (d3.mouse(this)[0] + 20) + "px")
                .style("top", (d3.mouse(this)[1] - height) + "px")
                .style("position", "relative")
        }

        var mouseleave = function(d) {
            Tooltip.style("opacity", 0)
        }


        // Separation between node clusters
        var pos_list = [];
        for (var i = 0; i <= 6; i++) {
            pos_list.push(i * (width / 12));
        }
        // Scale according to separation above
        var x = d3.scaleOrdinal()
            .domain(['Entertainment','Music','People & Blogs','News & Politics', 'Howto & Style', 'Sports','Comedy'])
            .range(pos_list)

        // Add the nodes/circles
        var node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", (d) => size(d.count))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", (d) => colorScale(d.category))
            .attr("stroke", "black")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)


        // Force between circles to make them leave the center to clusters
        var simulation = d3.forceSimulation()
            // Force attraction from same category
            .force("x", d3.forceX().strength(0.5).x((d) => x(d.category)))
            .force("y", d3.forceY().strength(0.1).y(height / 2))
            // Center attraction to stay inside space
            .force("center", d3.forceCenter().x(width / 2 - 100).y(height / 2))
            // Attraction between circles
            .force("charge", d3.forceManyBody().strength(.1))
            // Collision to avoid overlaps
            .force("collide", d3.forceCollide().strength(.2).radius((d) => size(d.count) + 3).iterations(1))


        // Apply the forces
        simulation.nodes(data)
            .on("tick", (d) => {
                node.attr("cx", (d) => d.x)
                    .attr("cy", (d) => d.y)
            });
        })
})();
