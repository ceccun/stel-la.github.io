function grab_ip(){
	var ip = new XMLHttpRequest();
	ip.open("GET", "http://gd.geobytes.com/GetCityDetails");
	ip.send();
	ip.onreadystatechange = (e) => {
  console.log(ip.responseText);
}
}