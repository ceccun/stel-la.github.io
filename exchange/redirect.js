function goTo(url){
	if (screen.width >= 1125){
		window.location = url + "?warned=1";
	} else{
		window.location = "mobile.html?uri=" + url + "?warned=1";
	}
}