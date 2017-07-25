// const hdr = {
//   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//   'Accept-Language': 'en-US,en;q=0.5',
//   'Cache-Control': 'max-age=0',
//   'Connection': 'keep-alive',
//   'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0'
// }

var export_list = new Object;

//TOP FUNCTION
function addResultItem(title, songlink) {
  $('#results').prepend(`<a onclick="showModal('<h4>Copied link!</h4>')" class="list-group-item clipboard" data-clipboard-text="` + songlink + `">
    <h4 class="list-group-item-heading">`+ title + `</h4>
    <p class="list-group-item-text">`+ songlink + `</p>
  </a>`);

  export_list["music-book-mark-" + title] = songlink;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
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
    case 'youtu.be':
      youtube(link);
      break;
    case 'mp3.zing.vn':
      zing(link);
      break;
    default:
      // console.log('Link cannot be converted! Hostname:' + getHostName(link))
      showModal(`<h4>Error: Link cannot be converted!<br> Hostname:` + getHostName(link) + `</h4>`, 2300)
      break;
  }

  $('#get-link').val('');
}

// to show any notification
function showModal(body, timeout = 900) {
  $('#alert-modal .modal-body').html(body);
  $('#alert-modal').modal('show');

  if (timeout != -1) {
    setTimeout(function () {
      $('#alert-modal').modal('hide');
    }, timeout);
  }
}

//-------------------------------------------------------------------------------------------
// ZING HANDLER
function getZingSongObj(_id) {
  url = '//api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id":' + '"' + _id + '"}'

  $.ajax({
    url: url,
    // headers: hdr,
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


  if (getHostName(userLink) == 'youtu.be') {
    var id = userLink.replace(/(^\w+:|^)\/\//, '').replace('youtu.be/', '');
  } else {
    var id = urlParam(userLink, 'v');
  }

  $.ajax({
    url: '/youtube/' + id,
    method: 'GET',
    dataType: 'json',
    data: { info: null },
    beforeSend: function () {
      showModal('<h5>Wait a moment</5> <img src="/img/Dual Ring.svg" height="60px">', 6000);
    },
    success: function (result) {
      addResultItem(result.title, result.linkdownload);
      $('#alert-modal').modal('hide');
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

$('#export-btn').click(function () {
  if ($.isEmptyObject(export_list)) {
    showModal('You have nothing to export!')
  } else {
    download('collections-from-durarara-music.json', JSON.stringify(export_list));
  }
})