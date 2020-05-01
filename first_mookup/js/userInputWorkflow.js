$(document).ready(function () {

    $("#searchChannel").show()

    $("#selectedChannel").hide()
    $("#titleInput").hide()
    $("#visualization").hide()

    $("#channelSearchInput").on("input", searchQuery)

    $("#titleInput").on("keyup", function(e) {
        if (e.keyCode === 13) {
            // Enter is clicked
            $("#titleInput").prop("disabled", true)
            $("#visualization").show(800)
        }
    })

    YouTubeAPI.getChannelInfo("UCHYx938B8ajXmtl-zpwLgtw")
})

function searchQuery(q) {
    var query = $("#channelSearchInput").val()

    if (query.length < 3) {
        displaySearchResults(null, true)
    } else {
        YouTubeAPI.searchChannels(query, function(channels) {
            console.log(channels);
            displaySearchResults(channels)
        })
    }
}

function displaySearchResults(results, requireLongerQuery=false) {
    const listElement = $("#searchResults .list-group")
    var listItems = []
    if (requireLongerQuery) {
        listItems.push(channelInfoToListItem(0, "Type at least 3 characters...", "img/loading.gif"))
    } else {
        listItems = results.map(r => channelInfoToListItem(r.id, r.title, r.imgUrl))
    }

    if (listItems.length == 0) {
        listItems.push(channelInfoToListItem(0, "No results 😱", "img/loading.gif"))
    }

    listElement.html(listItems.join(""))

    $(".list-group-item").click(function(e) {
        setSelectedChannel(e.target.dataset.channelid)
    })
}

function channelInfoToListItem(id, title, imgUrl) {
    return `<a href="#" class="list-group-item list-group-item-action" data-channelid="${id}">
        <img src="${imgUrl}">${title}
    </a>`
}

function setSelectedChannel(channelId) {
    const channel = YouTubeAPI.getChannelById(channelId)

    $("#searchChannel").hide()

    $("#selectedChannel").html(`<img src="${channel.imgUrl}">${channel.title}`)
    $("#selectedChannel").show()

    $("#titleInput").show()
}
