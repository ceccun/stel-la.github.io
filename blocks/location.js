const location_request = new XMLHttpRequest();
var url = "http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query";

location_request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
		var country = response.country;
				console.log(country);
				var proxy = response.proxy;
				console.log(proxy);
				if (proxy == false){
					var place = document.getElementById("location");
					place.innerText = " - " + country;
				} else{
										var place = document.getElementById("location");
					place.innerText = " - VPN";
				}
    }
};

location_request.open("GET", url, true);
location_request.send();