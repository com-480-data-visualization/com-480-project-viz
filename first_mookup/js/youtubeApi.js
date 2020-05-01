
const YouTubeAPI = (function() {
    const API_BASE_URL = "https://www.googleapis.com/youtube/v3"
    const API_KEY = "AIzaSyCfS6evZ3FmhWVQRk7OJXMml8qs_TLZTFs"
    var CHANNELS = {}

    function searchChannels(query, callback) {
        var options = {
            part: 'snippet',
            key: API_KEY,
            maxResults: 3,
            type: "channel",
            q: query
        }

        $.getJSON(API_BASE_URL + "/search", options, function (data) {
            const channels = data.items.map(e => { return {
                id: e.id.channelId,
                title: e.snippet.channelTitle,
                imgUrl: e.snippet.thumbnails.medium.url
            }})
            for (var c of channels) {
                CHANNELS[c.id] = c
            }
            callback(channels)
        });
    }

    function getChannelById(channelId) {
        return (CHANNELS.hasOwnProperty(channelId)) ? CHANNELS[channelId] : null
    }

    function getChannelInfo(channelId) {
        var options = {
            part: 'id, contentDetails, contentOwnerDetails, brandingSettings, topicDetails, statistics',
            key: API_KEY,
            id: channelId
        }
        $.getJSON(API_BASE_URL + "/channels", options, function (data) {
            console.log(data);
        });
    }

    return {
        searchChannels: searchChannels,
        getChannelById: getChannelById,
        getChannelInfo: getChannelInfo
    }

})();
