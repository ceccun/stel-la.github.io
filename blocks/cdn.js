function checkBlock(queryw){
const Http = new XMLHttpRequest();
const url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=1&exlimit=1&titles=" + queryw + "&explaintext=1&formatversion=2";
Http.open("GET", url);
Http.send();
console.log("BlocksAI - running.")
Http.onreadystatechange = (e) => {
  console.log(Http.responseText)
}
}