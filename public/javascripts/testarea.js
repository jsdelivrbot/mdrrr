function urlParam (url, name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
	return results[1] || 0;
}

console.log(urlParam('https://www.youtube.com/watch?v=uD6Qzt1vjGM&index=91&list=LLBk4NE5mZeAI7z8zXqmdUOg','v'))