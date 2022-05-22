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
console.log(readCookie('omniupdate'));

if ((readCookie("cookiecons") == null) && (document.URL.split("?")[0].endsWith("d.html"))){
	document.body.innerHTML = document.body.innerHTML + '<div id="cookienotfs" class="b-cookienotfs"><div id="cookienot" class="b-cookienot"><center><image src="/images/privacy.svg" style="width: 40%;"><h2>Before you continue</h2><p>Stella utilises technologies such as cookies (e.g web beacons, flash cookies, .etc)("cookies") to refine your experience and maximise performance on their sites. These cookies are collected when necessary and do not contain information that can uniquely identify you as an individual user. If you agree, Stella and their partners can use cookies to store, cache and control your session while using their sites.<br>Due to the technical limitations, if you do not consent to the usage of cookies, you should not visit any Stella site, including this one, for the next 30 days to confirm all cookies have been removed from your device.</p><button class="agreebtn" onclick="acceptcookienot()">I agree</button></center></div></div><link href="/en/cookie-d.css" rel="stylesheet"/>';
	setTimeout(function (){ document.getElementById("cookienotfs").setAttribute("class", "cookienotfs"); document.getElementById("cookienot").setAttribute("class", "cookienot") }, 300);
}

function acceptcookienot(){
	createCookie("cookiecons", "1", 30);
		setTimeout(() => {
			document.getElementById("cookienotfs").setAttribute("class", "b-cookienotfs"); document.getElementById("cookienot").setAttribute("class", "b-cookienot") }, 300);
			setTimeout(() => { 
				document.getElementById("cookienotfs").setAttribute("style", "display: none"); 
				document.getElementById("cookienot").setAttribute("style", "display: none;");
				window.location.replace("");
			}, 500);
}
