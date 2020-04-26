const location_request = new XMLHttpRequest();
var url = "https://ipapi.co/json";

location_request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
		var country = response.country_name;
				console.log(country);
					var place = document.getElementById("location");
					place.innerText = " - " + country;
    }
};

location_request.open("GET", url, true);
location_request.send();