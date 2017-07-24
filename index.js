var express = require('express');
var app = express();
var mylib = require('./static/javascript/mylib')
var ytController = require('./static/javascript/youtubeController')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/youtube/:id', function (request, response) {
  ytController.getYoutubeObj(request.params.id, function (title, linkdownload) {
    response.setHeader('Content-Type', 'application/json');
    
    response.send(JSON.stringify({
      title: title,
      linkdownload: linkdownload
    }));

  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


