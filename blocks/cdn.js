function checkBlock(queryw){
const Http = new XMLHttpRequest();
const url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&exlimit=1&titles=" + queryw + "&explaintext=1&formatversion=2&origin=*";
Http.open("GET", url);
Http.send();
console.log("BlocksAI - running.")
Http.onreadystatechange = (e) => {
  var wikipediaresponse = Http.responseText;
  console.log(wikipediaresponse);
  var split1 = wikipediaresponse.split('<span class="s2">&quot;extract&quot;</span><span class="o">:</span> <span class="s2">&quot;', 2);
  console.log(split1);
  var split2 = split1[1].split('&quot;', 1);
  console.log(split2);
  document.getElementById("blockscontent").innerHTML = split2;
  if (document.URL.includes("sonic") == true){
  document.getElementById("blockszone").setAttribute("style", "display: block; font-family: 'stella.typeface', sans-serif; padding-left: 30px; z-index: 3; position: relative; margin: 0; padding-top: 0; padding-bottom: 0; background-color: #ededed;  margin-bottom: -7px; width: 100%;");
  }
  if (document.URL.includes("bionic") == true){
	 document.getElementById("blockszone").setAttribute("style", "display: block; font-family: 'stella.typeface', sans-serif;s z-index: 2; position: relative; margin: 0; padding-top: 0; padding-bottom: 0; background-color: #ededed;  margin-bottom: 0px; padding-left: 30px; padding-right: 30px;");
	 document.getElementById("htext").innerHTML = '<a style="text-decoration: none; color: black;" onClick="searchme()"> \n <script type="text/javascript"> \n function searchme(){ \n document.getElementById("overlaybar").setAttribute("style", "display: inline; visibility: visible; position: fixed; z-index: 100000; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100%; height: 100vh; background-color: rgba(255,255,255,0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"); \n document.getElementById("overlaybar").setAttribute("class", "blurbackg"); \n document.getElementById("searchbar").setAttribute("class", "bringbar"); \n document.getElementById("searchbar").focus(); \n } \n </script>' + queryw + '</a>';
  }
  if (document.URL.includes("blocks") == true){
	 document.getElementById("result").innerHTML = split2;
  }
}
}