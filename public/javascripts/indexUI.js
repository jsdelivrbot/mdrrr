// const hdr = {
//   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//   'Accept-Language': 'en-US,en;q=0.5',
//   'Cache-Control': 'max-age=0',
//   'Connection': 'keep-alive',
//   'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0'
// }

var export_list = new Object;

//TOP FUNCTION
function resultItemClicked() {
  showModal('<h4>Copied!</h4>');
}

function addResultItem(title, songlink) {

  var btn_value = $('#toggle-linkonly-btn').attr('value');
  btn_value = (btn_value == 'true');

  var _copy = btn_value ? songlink : "/share " + songlink + " " + title;

  $('#results').prepend(`<a onclick="resultItemClicked()" class="list-group-item result-item-clipboard" songlink="` + songlink + `" songlink-with-prefix="/share ` + songlink + ` ` + title + `">
    <h4>`+ title + `</h4>
    <p>` + _copy + `</p>
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
  link = $('#get-link').val().trim();

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
      showModal(`<h4>Error: Link cannot be converted!<br>Hostname: ` + getHostName(link) + `</h4>`, 2300)
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
      console.log(data.title, data.link_download["128"]);

      if (data.link_download["128"] != undefined) {
        addResultItem(data.title, data.link_download["128"]);
      } else {
        showModal('<h4>Cannot find the song you are looking for</h4>');
      }
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
      showModal('<h5>Wait a moment</5> <img src="/img/Dual Ring.svg" height="60px">', -1);
    },
    success: function (result) {
      console.log(result);
      if (result.linkdownload != 'error') {
        console.log('ok ne');
        $('#alert-modal').modal('hide');
        addResultItem(result.title, result.linkdownload);
      } else {
        $('#alert-modal').modal('hide');
        console.log('khong tim thay ne');
        setTimeout(function () {
          showModal('<h4>Cannot find the song you are looking for</h4>');
        }, 1400);
      }
    }, timeout: 10000
  }).catch(function (e) {
    if (e.statusText == 'timeout') {
      console.log('het gio ne');
      $('#alert-modal').modal('hide');
      setTimeout(function () {
        showModal('<h4>Cannot find the song you are looking for</h4>');
      }, 1400);
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
    showModal('<h4>You have nothing to export!</h4>')
  } else {
    download('collections-from-durarara-music.json', JSON.stringify(export_list));
  }
})

$('#toggle-linkonly-btn').click(function () {
  var current_value = $('#toggle-linkonly-btn').attr('value');
  current_value = (current_value == 'true')
  current_value = !current_value;
  $('#toggle-linkonly-btn').attr('value', current_value);

  if (current_value) {
    $('#toggle-linkonly-btn').text('use share command');

    $('#results a').each(function () {
      var change = $(this).attr('songlink')
      $('p', this).text(
        change
      )

    })
  } else {
    $('#toggle-linkonly-btn').text('use link only');

    $('#results a').each(function () {
      var change = $(this).attr('songlink-with-prefix')

      $('p', this).text(
        change
      )

    })
  }

})