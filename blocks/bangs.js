function createCookie(name,valued,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+valued+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function createBang(parameter, name, url, type){
    if (readCookie("bangs") == null){
        var bangs = ",";
    }else{
        var bangs = readCookie("bangs") + ',';
    }
	bangs = bangs + (encodeURIComponent(parameter) + "#" + encodeURIComponent(name) + "#" + encodeURIComponent(url) + "#" + encodeURIComponent(type));
	console.log(bangs);
    createCookie("bangs", bangs, 365);
}

function getBangs(){
	var bangs = readCookie("bangs");
	bangs = bangs.split(",");
	bangs.splice(0,1);
	var bangsarr = [];
	bangs.forEach(function (item, index){
		try{
		var parameter = decodeURIComponent(item.split('#')[0]);
		console.log(parameter);
		var name = decodeURIComponent(item.split('#')[1]);
		console.log(name);
		var url = decodeURIComponent(item.split('#')[2]);
		var type = decodeURIComponent(item.split('#')[3]);
		var json = { "parameter": parameter,
	"name": name,
	"url": url,
	"type": type
	};
	bangsarr.push(json);
	}catch(err){
		
	}
	});
	return bangsarr;
}

function queryBangs(query){
	try{
    var bangs = readCookie("bangs");
	bangs = bangs.split(",");
	bangs.splice(0,1);
	var output = null;
	var cur = 1;
    bangs.forEach(function (item, index){
		try{
		var parameter = decodeURIComponent(item.split('#')[0]);
		console.log(parameter);
		var name = decodeURIComponent(item.split('#')[1]);
		console.log(name);
		var url = decodeURIComponent(item.split('#')[2]);
		var type = decodeURIComponent(item.split('#')[3]);
		if (query.startsWith(parameter + name)){
			output = cur;
		}
		cur += 1;
	}catch(err){
		
	}
	});
	if (output != null){
	return output;
	} else{
		return null;
	}
} catch(err){
	return null;
}
}

function doBang(bang){
	try{
	var bangIndex = queryBangs(bang);
	var bange = readCookie("bangs");
	var item = bange.split(",")[bangIndex];
	var parameter = decodeURIComponent(item.split('#')[0]);
	var name = decodeURIComponent(item.split('#')[1]);
	var url = decodeURIComponent(item.split('#')[2]);
	var type = decodeURIComponent(item.split('#')[3]);
	if (type == 'goto'){
		window.location = url;
	}
	if (type == 'search'){
		var searchTerm = bang.replace(parameter + name + " ", "");
		if (searchTerm == ''){
			window.location = url.split("/")[0] + "//" + url.split("/")[2];
		} else{
			window.location = url.replace("%s", searchTerm);
		}
	}
}catch(err){
	return null;
}
}