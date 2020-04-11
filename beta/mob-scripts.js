var content = document.getElementById("content");
var header = document.getElementById("flex-header");
content.setAttribute("style", "height: " + (window.innerHeight - header.offsetHeight) + "px");
console.log("ResponseDesign - Content Height Set");
var content_scrollY = content.scrollTop;
console.log(content_scrollY);
var title = document.getElementById("title");
contentCali();

function contentCali(){
	content_scrollY = content.scrollTop;
	if (content_scrollY >= 0 && 10 >= content_scrollY){
		title.setAttribute("style", "margin-top: " + (40 - content_scrollY) + "px; font-size: " + (40 - content_scrollY) + "px;");
	}
		if (content_scrollY >= 10 && 40 >= content_scrollY){
		title.setAttribute("style", "margin-top: " + (40 - content_scrollY) + "px; font-size: 30px;");
	}
		if (content_scrollY >= 40){
		title.setAttribute("style", "margin-top: 0px; font-size: 30px;");
	}
			if (content_scrollY <= 0){
		title.setAttribute("style", "margin-top: 40px; font-size: 40px;");
	}
	content.setAttribute("style", "height: " + (window.innerHeight - header.offsetHeight) + "px");
			setTimeout("contentCali()", 20);
}