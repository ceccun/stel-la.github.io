/* Blocks AI Engine 5.8.74 by stella group. All rights reserved.*/

function checkBlock(queryw){
	var newquestion = queryw;
	var newquestion = newquestion.toLowerCase();
	if (readCookie("kaou") == "3"){
		placement("How's it going? We want to know if you're okay. If you're just researching topics like these, you can skip this otherwise continue. We're trying our best to look out for you so we want to let you know that help is available.<br>United Kingdom: Text 'SHOUT' to 85258; SHOUT<br>United States: Dial +1-800-273-8255; the NSPL<br>Canada: Dial +1-818-831-1234; Thursday's Child<br> Australia: 1800 650 890; headspace<br>Japan: Dial 03-4550-1146 (English); TELL<br><br>We love you.", "fact", "Hey, over here!");
		return;
	}
	if (newquestion.includes("anxiety") || newquestion.includes("suicide") || newquestion.includes("eating disorder") || newquestion.includes("kill myself") || newquestion.includes("killing myself") || newquestion.includes("sad")){
		if (readCookie("kaou") == null){
			createCookie("kaou", "0", 30);
		}
		var newkao = parseInt(readCookie("kaou"));
		createCookie("kaou", String(newkao + 1), 30);
		placement("Whatever you're going through, we're standing with you. <br>Get help for the mental state you're in:<br>United Kingdom: Text 'SHOUT' to 85258; SHOUT<br>United States: Dial +1-800-273-8255; the NSPL<br>Canada: Dial +1-818-831-1234; Thursday's Child<br> Australia: 1800 650 890; headspace<br>Japan: Dial 03-4550-1146 (English); TELL<br><br>You shouldn't have to suffer and stay quiet about it, whatever it is, you'll get through to see the end of it.<br>Love, Stella.", "fact", "Standing With You");
		return;
	}
	if (newquestion.includes("?") == true) {
			var newquestion = newquestion.split("?")[0];
		}
	if (newquestion.includes("what is") == true) {
		if (newquestion.includes("the") == true) {
		var newquestion = newquestion.split("what is the");
		var newquestion = newquestion[newquestion.length - 1];
		if (newquestion == " capital of bangladesh" || newquestion == "capital of bangladesh"){
					var result = "Sylhet";
			placement(result, "fact", newquestion);
			return;
		}
		}
		if (newquestion.includes("a") == true) {
		var newquestion = newquestion.split("what is a");
		var newquestion = newquestion[newquestion.length - 1];
		}
				if (newquestion.includes("an") == true) {
		var newquestion = newquestion.split("what is an");
		var newquestion = newquestion[newquestion.length - 1];
		}
				if (newquestion.includes("") == true) {
		var newquestion = newquestion.split("what is");
		var newquestion = newquestion[newquestion.length - 1];
		}
	}
	if (newquestion.includes("who is") == true) {
		if (newquestion.includes("the") == true) {
		var newquestion = newquestion.split("who is the");
		var newquestion = newquestion[newquestion.length - 1];
		}
		if (newquestion.includes("a") == true) {
		var newquestion = newquestion.split("who is a");
		var newquestion = newquestion[newquestion.length - 1];
		}
				if (newquestion.includes("") == true) {
		var newquestion = newquestion.split("who is");
		var newquestion = newquestion[newquestion.length - 1];
		}
	}
	if (newquestion.includes("when is") == true) {
		var newquestion = newquestion.split("when is");
		var newquestion = newquestion[newquestion.length - 1];
		if (newquestion == " christmas" || newquestion == "christmas"){
					var result = "Christmas Day is on the 25th of December.";
			placement(result, "fact", newquestion);
			return;
		}
		if (newquestion == " ihfaz" || newquestion == "ihfaz"){
			var result = "Pussymagnet69"
			placement("ihfaz_rm", "fact", result)
			return;
		}
		if (newquestion == " eid" || newquestion == "eid"){
					var result = "Eid al-Fitr 2020 begins at night on Saturday 23rd May.";
			placement(result, "fact", newquestion);
			return;
		}
				if (newquestion == " eid al-fitr" || newquestion == "eid al-fitr" || newquestion == " eid fitr" || newquestion == " eid al fitr"){
					var result = "Eid al-Fitr 2020 begins at night on Saturday 23rd May.";
			placement(result, "fact", newquestion);
			return;
		}
				if (newquestion == " eid al-adha" || newquestion == "eid al-adha" || newquestion == " eid adha" || newquestion == " eid al adha"){
					var result = "Eid al-Adha 2020 begins at night on Thursday 30th July. Compared to Eid al-Fitr, it lasts approximately 3 days.";
			placement(result, "fact", newquestion);
			return;
		}		
	}
		if (newquestion == " time" || newquestion == "time"){
			sendTime();
		} else {
				if (newquestion == " date" || newquestion == "date"){
			sendDate();
		} else {
						if (newquestion == " day" || newquestion == "day" || newquestion == "day today"){
			sendDay();
		} 
		
		
		else {
		checkWiki(newquestion);
}}}
	}
	
	function checkWiki(question) {
		  try{
	  math.eval(question);
	  var result = math.eval(question).toString();
	  placement(result, "math", question);
	return;
  }
    catch(err){
const Http = new XMLHttpRequest();
const url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=2&titles=" + question + "&explaintext=1&formatversion=2&origin=*&format=json";
Http.open("GET", url);
Http.send();
console.log("BlocksAI - running.");
Http.onreadystatechange = (e) => {
	if (Http.readyState == 4 && Http.status == 200){
  var result = JSON.parse(Http.responseText);
  question = result.query.normalized[0].to;
  var res = result.query.pages[0].extract;
  if (res != ""){
	  placement(res, "fact", question);
  }
	}
};
	}
}
function sendTime(){
	var timing = new Date();
			var hour = timing.getHours().toString();
			var minute = timing.getMinutes().toString();
			if (hour.length == 1){
				var hour = "0" + hour;
			}
				if (minute.length == 1){
				var minute = "0" + minute;
			}
			var result = "The current time is " + hour + ":" + minute + " in your timezone.";
			placement(result);
			return;
}
function sendDate(){
	var timing = new Date();
			var date = timing.getDate().toString();
			var commonSense_months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var month = commonSense_months[timing.getMonth()];
			var prefix = "th";
			if (date.slice(date.length - 1) == "3"){ var prefix = "rd" }
			if (date.slice(date.length - 1) == "2"){ var prefix = "nd" }
			var result = "It is the " + date + prefix + " of " + month + ".";
			placement(result, "fact", newquestion);
			return;
}
function sendDay(){
	var timing = new Date();
			var commonSense_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
			var day = commonSense_days[timing.getDay() - 1];
			var result = "Today is " + day + ".";
			placement(result, "fact", newquestion);
			return;
}
