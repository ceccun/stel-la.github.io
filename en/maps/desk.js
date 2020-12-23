        mapboxgl.accessToken = 'pk.eyJ1Ijoic3RyZWFtY29tcGFueSIsImEiOiJjam1odjZsZW0yZ2t4M3ZsaG0yaHZvMmJxIn0.REMyxJ7y41LJY_nX2GGwGQ';
        var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11'
        });
        var units = "km";
                document.getElementById("tray-input-show").setAttribute("placeholder", "Say “Hey Stella!”");
                function openSearch(){
                    if (country == "gb"){
                        document.getElementById("p31").innerText = "There may be more personalised services on your nearby feed.";
                    }
                    
                    document.getElementById("tray-input-show").blur();
                    document.getElementById("search-screen").setAttribute("style", "");
                    setTimeout(function (){ document.getElementById("search-screen").setAttribute("class", "search-screen");
                    document.getElementById("realSearchBox").focus(); }, 100);
                    
                }
                function closeSearch(){
                    document.getElementById("search-screen").setAttribute("class", "search-screen-h");
                    document.getElementById("realSearchBox").blur();
                    setTimeout(function (){ document.getElementById("search-screen").setAttribute("style", "display: none;"); }, 200)
                }
                var country = "US";
                var longitude = 0;
                var latitude = 0;
                function initializeNearby(){
                    document.getElementById("tray-inner-nearby-loading").setAttribute("style", "");
                    if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(function(e){
    window["longitude"] = e.coords.longitude;
    window["latitude"] = e.coords.latitude;
    var geocoding = new XMLHttpRequest();
    geocoding.open("GET", "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ e.coords.longitude.toString() +"," + e.coords.latitude.toString() + ".json?types=place&access_token=pk.eyJ1Ijoic3RyZWFtY29tcGFueSIsImEiOiJjam1odjZsZW0yZ2t4M3ZsaG0yaHZvMmJxIn0.REMyxJ7y41LJY_nX2GGwGQ");
    geocoding.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            
        document.getElementById("tray-inner-nearby").setAttribute("style", "");
                    document.getElementById("tray-inner-nearby-loading").setAttribute("style", "display: none;");
            console.log(this.responseText);
            var json = JSON.parse(this.responseText);
            if (json.features[0].context[json.features[0].context.length - 1].short_code == "gb"){
                document.getElementById("hotels-label").innerText = "Stay";
                document.getElementById("gas-label").innerText = "Petrol";
                document.getElementById("groceries-label").innerText = "Shops";
                country = "gb";
                units = "mi";
            }
            if (json.features[0].text != "Barking"){
                
                setTimeout(function (){document.getElementById("wifi-nearby-icon").setAttribute("class", "tray-inner-nearby-item-deactivating")}, 500);
                setTimeout(function () { document.getElementById("wifi-nearby-icon").setAttribute("style", "display: none;") }, 1000);
            }
            document.getElementById(
                "tray-inner-nearby-list-title").innerText = json.features[0].text;
            getSearchResults();
        }
    }
    geocoding.send();
}, function (e){
    document.getElementById("tray-inner-nearby-broken").setAttribute("style", "");
    document.getElementById("tray-inner-nearby-loading").setAttribute("style", "display: none;");
    console.log(e.code);
    if (e.code == 1){
        document.getElementById("tray-inner-nearby-broken").innerHTML = '<image class="r-img" src="../../images/map/location-off.png"></image><h3>Location Denied</h3><p>Stella Location Services are off, so nearby services aren\'t being shown.</p>';
    }
    if (e.code == 2){
        document.getElementById("tray-inner-nearby-broken").innerHTML = '<image class="r-img" src="../../images/map/cloud-error.png"></image><h3>Aw Snap!</h3><p>Stella Location Services encountered an error while determining your location, so nearby services aren\'t being shown.</p>';
    }
    if (e.code == 3){
        document.getElementById("tray-inner-nearby-broken").innerHTML = '<image class="r-img" src="../../images/map/cloud-error.png"></image><h3>Something Happened</h3><p>Your phone did something unexpected, so nearby services aren\'t being shown.</p>';
    }
});
} else {
document.getElementById("tray-inner-nearby-broken").setAttribute("style", "");
    document.getElementById("tray-inner-nearby-loading").setAttribute("style", "display: none;");
        document.getElementById("tray-inner-nearby-broken").innerHTML = '<image class="r-img" src="../../images/map/location-off.png"></image><h3>Unsupported Device</h3><p>This device doesn\'t support Stella Location Services, so nearby services aren\'t being shown.</p>';
}
                }

function getSearchResults(){
var nearbyresults = new XMLHttpRequest();
nearbyresults.open("GET", "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ longitude + "," + latitude + ".json?types=poi&access_token=pk.eyJ1Ijoic3RyZWFtY29tcGFueSIsImEiOiJjam1odjZsZW0yZ2t4M3ZsaG0yaHZvMmJxIn0.REMyxJ7y41LJY_nX2GGwGQ&limit=7");
nearbyresults.onreadystatechange = function (){
    if (this.readyState == 4 && this.status == 200){
        var t = JSON.parse(this.responseText)
        t.features.forEach(function (item, index){
            var cat = item.properties.category.split(", ");
            var cate = cat[0].split(" ");
            var newcate = "";
            cate.forEach(function (item, index){
                newcate = newcate + item.charAt(0).toUpperCase() + item.slice(1) + " "
            });
            document.getElementById("tray-inner-nearby-list-service").innerHTML = document.getElementById("tray-inner-nearby-list-service").innerHTML + '<div class="tray-inner-nearby-list-block"><h3>' + item.text + '</h3><p>' + newcate + '</p></div>';
        })
    }
}
nearbyresults.send();
}

initializeNearby();

pageMgr = 10;

        function openPage(page, customhtml){
            pageMgr += 1;
            var target = document.getElementById("pages");
            var newpage = document.createElement('div');
            newpage.setAttribute("class", "page-fs-h");
            newpage.setAttribute("style", "z-index: " + pageMgr + " !important;");
            newpage.setAttribute("id", "page-" + pageMgr.toString());
            newpage.innerHTML = '<div class="page-topbar"><a onclick="closePage(' + pageMgr + ')"><p>Back</p></a><p><b>' + page +'</b></p><p>&nbsp;</p></div>';
            if (customhtml == undefined){
            if(page == 'About'){
                var size = document.getElementById("html").innerHTML.split('').length;
                console.log(size);
                newpage.innerHTML += '<div style="margin-top: 10px;"><h1>Stella Maps</h1><p>© Ejaz Ali</p><div class="about-page-bblock"><p>© Maxar</p><p>© OpenStreetMap</p><p>Mapbox</p></div><p>3.0.10🅲<br>build id: MTk6NDAgMTkvMTIvMjAyMA==<br>client ram usage (exmap): ' + (size/1000)  +' KB</div><style>.about-page-bblock{ display: flex; justify-content: space-around; } .about-page-bblock p { margin-top: 10px; padding: 10px; border: solid 1px rgba(0,0,0,0.3); border-radius: 20px; } @media(prefers-color-scheme: dark){ .about-page-bblock p { border: solid 1px rgba(255,255,255,0.3); } }</style>';
            }
        }
        if (customhtml != undefined){
            newpage.innerHTML += customhtml;
        }
            target.appendChild(newpage);
            setTimeout(function () { document.getElementById("page-" + pageMgr.toString()).setAttribute("class", "page-fs"); }, 300);
        }

        function closePage(number){
            var target = document.getElementById("page-" + number);
            target.setAttribute("class", "page-fs-h");
            setTimeout(function (){ target.remove(); }, 300);
        }

        var nearbyactive = 0

        function loadcall(){
            newSearchPH();
        }

        function viewPlace(coords, name, address){
            
        }

        function newSearchPH(){
            var numerics = Math.floor(Math.random() * 4);
            if (numerics == 0){
            document.getElementById("tray-input-show").setAttribute("placeholder", "Search for monuments");
            }
            if (numerics == 1){
            document.getElementById("tray-input-show").setAttribute("placeholder", "Search for restuarants");
            }
            if (numerics == 2){
            document.getElementById("tray-input-show").setAttribute("placeholder", "Search for shops");
            }
            if (numerics == 3){
            document.getElementById("tray-input-show").setAttribute("placeholder", "Search for hotels");
            }
        }

        function maptap(){
            window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
        }