const hdr = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:45.0) Gecko/20100101 Firefox/45.0'
}

function getSongObj(_id) {
  url = '//api.mp3.zing.vn/api/mobile/song/getsonginfo?requestdata={"id":' + '"' + _id + '"}'

  $.ajax({
    url: url,
    headers: hdr,
    method: 'GET',
    dataType: 'jsonp',
    data: { info: null },
    success: function (data) {
      addItem(data);
    }
  });
}

function addItem(data) {
  $('#item1 .list-group-item-heading').html(data.title);
  $('#item1 .list-group-item-text').html(data.link_download["128"]);
}

function extractID(_link) {
  var id = _link.split('/').pop().replace(/.html*$/, "");
  return id;
}



function zing(){
  link = $('#get-link').val();
  console.log(link);
  id = extractID(link);
  getSongObj(id); 
  $('#get-link').val('');
}

$('#get-btn').click(function(){
  zing();
})

$("#get-link").keyup(function(event){
    if(event.keyCode == 13){
        zing();
    }
});

// id = extractID("http://mp3.zing.vn/bai-hat/Co-Dieu-Gi-Sao-Khong-Noi-Cung-Anh-Trung-Quan-Idol/ZW7FDCCE.html");
// getSongObj(id)


