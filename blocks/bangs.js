var bstorage = window.localStorage;

if (bstorage.getItem("bangs") == null){
	bstorage.setItem("bangs", ",!#yt#https%3A%2F%2Fwww.youtube.com%2Fresults%3Fsearch_query%3D%25s#search");
}

function createBang(parameter, name, url, type){
    if (bstorage.getItem("bangs") == null){
        var bangs = ",";
    }else{
        var bangs = bstorage.getItem("bangs") + ',';
    }
	bangs = bangs + (encodeURIComponent(parameter) + "#" + encodeURIComponent(name) + "#" + encodeURIComponent(url) + "#" + encodeURIComponent(type));
	console.log(bangs);
	bstorage.setItem("bangs", bangs);
}

function getBangs(){
	var bangs = bstorage.getItem("bangs");
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
    var bangs = bstorage.getItem("bangs");
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
	var bange = bstorage.getItem("bangs");
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
