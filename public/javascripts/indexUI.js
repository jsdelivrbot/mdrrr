const hdr = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0'
}

//TOP FUNCTION
function addResultItem(title, songlink) {
  $('#results').prepend(`<a onclick="showModal('<h4>Copied link!</h4>')" class="list-group-item clipboard" data-clipboard-text="` + songlink + `">
    <h4 class="list-group-item-heading">`+ title + `</h4>
    <p class="list-group-item-text">`+ songlink + `</p>
  </a>`);
}

function urlParam(url, name) {
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
  return results[1] || 0;
}

function getHostName(url) {
  var hostname;

  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

//main function of the cotroller
function convert() {
  link = $('#get-link').val();

  switch (getHostName(link)) {
    case 'www.youtube.com':
      youtube(link);
      break;
    case 'youtube.com':
      youtube(link);
      break;
    case 'mp3.zing.vn':
      zing(link);
      break;
    default:
      // console.log('Link cannot be converted! Hostname:' + getHostName(link))
      showModal(`<h4>Error: Link cannot be converted! Hostname:<br>` + getHostName(link) + `</h4>`, 2300)
      break;
  }

  $('#get-link').val('');
}

function showModal(body, timeout = 900) {
  $('#alert-modal .modal-body').html(body);
  $('#alert-modal').modal('show');

  setTimeout(function () {
    $('#alert-modal').modal('hide');
  }, timeout);
}

//ZING HANDLER
function getZingSongObj(_id) {
  url = '//api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id":' + '"' + _id + '"}'

  $.ajax({
    url: url,
    headers: hdr,
    method: 'GET',
    dataType: 'jsonp',
    data: { info: null },
    success: function (data) {
      addResultItem(data.title, data.link_download["128"]);
    }
  });
}

function zing(link) {
  var id = link.split('/').pop().replace(/.html*$/, "");
  getZingSongObj(id);
}

//YOUTUBE HANDLER
function youtube(userLink) {
  console.log(userLink);

  id = urlParam(userLink, 'v');

  // $.getJSON(, function (result) {
  //   // addResultItem(result.item)
  //   console.log(result.title, result.linkdownload);
  // })
  console.log('//durarara.herokuapp.com/youtube/' + id);

  $.ajax({
    url: '//durarara.herokuapp.com/youtube/' + id,
    headers: hdr,
    method: 'GET',
    dataType: 'jsonp',
    success: function (result) {
      // addResultItem(result.title, result.downloadlink);
      console.log(result);
    }
  });
}


//UI HANDLER
$('#get-btn').click(function () {
  convert();
})

$("#get-link").keyup(function (event) {
  if (event.keyCode == 13) {
    convert();
  }
});

$('.link-item').click(function () {
  showModal(`<h5>Copied link!</h5>`)
})