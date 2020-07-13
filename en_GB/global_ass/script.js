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

if (readCookie('omniupdate') == null){
	var cookie = Math.floor(Math.random()*2);
	if (cookie == 1){
createCookie('omniupdate','1',7);
	} else{
		createCookie('omniupdate','0',7);
		window.location.replace("https://stella.hs.vc/classic");
	}
} else{
	if (readCookie('omniupdate') == "0"){
		window.location.replace("https://stella.hs.vc/classic");
	}
}
console.log(readCookie('omniupdate'));