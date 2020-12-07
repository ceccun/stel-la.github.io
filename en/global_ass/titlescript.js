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

function filla(){
if (readCookie("country") == null){
var s = new XMLHttpRequest();
s.open("GET", "https://ipapi.co/json");
s.onreadystatechange = function (){
	if(this.readyState == 4 && this.status == 200){
		var t = JSON.parse(this.responseText);
		createCookie("country", t.country, 4);
	}
}
s.send();
}
var r = new XMLHttpRequest();
r.open("GET","/en/global_ass/titlescript.json");
r.onreadystatechange = function(){
if (this.readyState == 4 && this.status == 200){
	var resp = JSON.parse(this.responseText);
	var co = readCookie("country");
	console.log(resp[co]);
	if (resp[co] != undefined){
	document.getElementById("local-area").innerHTML = resp[co];
	}
}
}
r.send();
}