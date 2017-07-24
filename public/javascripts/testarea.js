var unirest = require('unirest');
// These code snippets use an open-source library. http://unirest.io/nodejs
unirest.post("https://savedeo.p.mashape.com/download")
.header("X-Mashape-Key", "QAEDPv3TDQmshzyLPEvk3T30Gz9pp1BwtUOjsniRJt1zOMcQar")
.header("Content-Type", "application/x-www-form-urlencoded")
.header("Accept", "application/json")
.send("url=https://www.youtube.com/watch?v=K6AfSckWSZA")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});