var request = require('request');

function getInfo(_id, callback) {
    url = 'http://api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id":' + '"' + _id + '"}'


    request(url, function (error, response, body) {
        if (error) {
            console.log('error:', error);
            callback(null, true);
        } else {
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.

            info = JSON.parse(body);
            // console.log(info.link_download['128']);
            // console.log(info);
            callback(info, false)
        }
    });

}

function stripID(_link) {
    id = _link.split('/').pop().replace(/.html*$/, "");
    return id;
}

// stripID("http://mp3.zing.vn/bai-hat/Senbonsakura-Instrumental-Kaoru-Sakuma/ZW7AD0D7.html")
// _id = 'ZW7AD0D7';



module.exports.getInfo = getInfo;
module.exports.stripID = stripID;

