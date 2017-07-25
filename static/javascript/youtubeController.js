var unirest = require('unirest')
var tinyurl = require('tinyurl')

function getYoutubeObj(id, fn) {
    linkJSON = 'https://getvideo.p.mashape.com/?url=' + 'https://www.youtube.com/watch?v=' + id;
    unirest.get(linkJSON)
        .header("X-Mashape-Key", "QAEDPv3TDQmshzyLPEvk3T30Gz9pp1BwtUOjsniRJt1zOMcQar")
        .header("Accept", "text/plain")
        .end(function (result) {
            // console.log(result.status, result.headers, result.body);
            
            song = JSON.parse(result.body);
            // console.log(song);
            console.log(song.status);

            if (song.status == false) {
                fn('error','error')
                return;
            }

            tinyurl.shorten(song.streams[0].url, function (shortlink) {
                fn(song.title, shortlink)
            });

        });
}


module.exports.getYoutubeObj = getYoutubeObj;

// getYoutubeObj('gdidfRamFcc',function (title, shortlink) {
//     console.log(title);
//     console.log(shortlink);
// });
