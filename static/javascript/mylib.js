function urlParam (url, name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
	return results[1] || 0;
}

module.exports.urlParam = urlParam;