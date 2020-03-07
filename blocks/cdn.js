function checkBlock(queryw){
const Http = new XMLHttpRequest();
const url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=2&titles=" + queryw + "&explaintext=1&formatversion=2&origin=*&format=json";
Http.open("GET", url);
Http.send();
console.log("BlocksAI - running.");
Http.onreadystatechange = (e) => {
	  try{
	  math.evaluate(queryw);
	  var result = math.evaluate(queryw).toString();
	return result;
  }
  catch(err){
	  var result = (Http.responseText.split('"extract":"'));
	  	  var result1 = result[1].split('"}');
		  var result = result1[0]
	  placement(result);
  }
};
}