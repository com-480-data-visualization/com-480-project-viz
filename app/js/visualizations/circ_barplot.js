(function() {
    const selector = "#circ_barplot"
    const selectorCategorySelect = "#circ_barplot_button"

    // dimensions, radius and margins of the graph
    var margin = {top: 100, right: 0, bottom: 0, left: 0},
        width = $(selector).width() - margin.left - margin.right,
        height = $(selector).height() - margin.top - margin.bottom,
        innerRadius = 100,
        // From center to the border of the SVG
        outerRadius = Math.min(width, height)/2;

    // append the svg object
    var svg = d3.select(selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    d3.csv("data/circ_barplot.csv", function(data) {
        // X scale
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])  // 0 to 2pi for full circle
            .domain(data.map(function(d) {return d.cat0; }));  // any list of categories for the domain works

        // Y scale
        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, data[0]['Autos & Vehicles']]); // The max value for the first category

        // List of categories
        var allCategories = [
            'Autos & Vehicles',
            'Comedy',
            'Education',
            'Entertainment',
            'Film & Animation',
            'Gaming',
            'Howto & Style',
            'Movies',
            'Music',
            'News & Politics',
            'Nonprofits & Activism',
            'People & Blogs',
            'Pets & Animals',
            'Science & Technology',
            'Shows',
            'Sports',
            'Travel & Events'
        ]


        // Select category: add the options to the button
        d3.select(selectorCategorySelect)
            .selectAll('myOptions')
            .data(allCategories)
            .enter()
            .append('option')
            .text((d) => d)
            .attr("value", (d) => d)


        // PLOT
        // Add the bars for the first option
        var bars = svg
            .append("g")
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("fill", "rgb(250, 119, 53)")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => y(d['Autos & Vehicles']))
                .startAngle((d) => x(d.cat0))
                .endAngle((d) => x(d.cat0) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius)
            )

        // Add the labels for the first option
        var labels = svg
            .append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("text-anchor", (d) => (x(d.cat0) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
            .attr("transform", (d) => "rotate(" + ((x(d.cat0) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['Autos & Vehicles'])+10) + ",0)")
            .append("text")
            .text((d) => d.cat0)
            .attr("transform", (d) => (x(d.cat0) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")



        // When an option is changed in the dropdown
        d3.select(selectorCategorySelect).on("change", function(d) {
            var selectedOption = d3.select(this).property("value")

            // Pick the column of categories to use as labels
            for (i = 0; i < allCategories.length; i++){
                if (allCategories[i] == selectedOption){
                    console.log('cat' + i.toString())
                    var selectedCat = 'cat' + i.toString()
                    break;
                }
            }

            //adapt scale to the category
            y.range([innerRadius, outerRadius])
                .domain([0, data[0][selectedOption]]);

            //update the bar values
            bars
                .data(data)
                .attr("fill", "rgb(250, 119, 53)")
                .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => y(d[selectedOption]))
                .startAngle((d) => x(d.cat0))
                .endAngle((d) => x(d.cat0) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))


            // update the labels
            labels.data(data)
                .attr("text-anchor", (d) => (x(d[selectedCat]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
                .attr("transform", (d) => "rotate(" + ((x(d['cat0']) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d[selectedOption])+10) + ",0)")
                .text((d) => d[selectedCat])
                .attr("transform", (d) => (x(d[selectedCat]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)")
        })
    });
})();
