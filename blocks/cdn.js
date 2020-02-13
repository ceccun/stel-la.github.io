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
  document.getElementById("blockszone").setAttribute("style", "display: block; font-family: 'stella.typeface', sans-serif; padding-left: 30px; z-index: 3; position: relative; margin: 0; padding-top: 0; padding-bottom: 0; background-color: #ededed;  margin-bottom: -7px; width: 100%;")
}
}