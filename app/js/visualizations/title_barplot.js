(function() {
    const selector = "#title_barplot"
    const selectorCategorySelect = "#title_button"

    // Dimensions and margin
    var margin = {top: 30, right: 0, bottom: 70, left: 60},
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom;

    var svg = d3.select(selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create Title
    svg.append("text")
        .attr("x", width / 2 )
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("Number of words used per video for each category");

    // X scale
    var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // text label for the x axis
    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Number of words");

    // Y scale
    var y = d3.scaleLinear()
        .range([ height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of videos");



    // categories
    var allCategories = ["ALL",
                         "Film and Animation",
                         "Cars and Vehicles",
                         "Music",
                         "Pets and Animals",
                         "Sport","Travel and Events",
                         "Gaming",
                         "People and Blogs",
                         "Comedy",
                         "Entertainment",
                         "News and Politics",
                         "How to and Style",
                         "Education",
                         "Science and Technology",
                         "Non Profits and Activism"]


    // Select category: add the options to the button
    d3.select(selectorCategorySelect)
        .selectAll('myOptions')
        .data(allCategories)
        .enter()
        .append('option')
        .text((d) => d)
        .attr("value", (d) => d)



    // Read Data
    d3.csv("data/title.csv", function(data) {
        function update(selectedCat) {
            // add X axis
            x.domain(data.map((d) => d["count"]))
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            // Add Y axis
            y.domain([0, d3.max(data, (d) => +d[selectedCat]) ]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            var bars = svg.selectAll("rect").data(data)

            bars.enter()
                .append("rect")
                .merge(bars)
                .transition()
                .duration(1000)
                .attr("x", (d) => x(d["count"]))
                .attr("y", (d) => y(d[selectedCat]))
                .attr("width", x.bandwidth())
                .attr("height", (d) => height - y(d[selectedCat]))
                .attr("fill", "rgb(250, 119, 53)");
        }

        // Initialize plot with first category
        update(allCategories[0])

        // Update when an option is changed in the dropdown
        d3.select(selectorCategorySelect).on("change", function(d) {
            update(d3.select(this).property("value"))
        })
    });
})();
