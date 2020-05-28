$(document).ready(function () {
    // $(".visualization").hide()
    //
    // $("#start").click(function(e) {
    //     $(".visualization").show()
    // })

    Map.draw("#map_category_distr");

    PublishTimeHeatmap.drawWeekday("#publish_time_heatmap_weekday");
    PublishTimeHeatmap.drawMonth("#publish_time_heatmap_month");
})


Number.prototype.format = function() {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
