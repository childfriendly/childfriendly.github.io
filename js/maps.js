var map;
var arrMarkers = [];
var arrInfoWindows = [];

function mapInit() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(49.839996, 24.036611)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Визначаємо область відображення міток на мапі
    var latlngbounds = new google.maps.LatLngBounds();

    //Завантажуємо дані в форматі JSON з файлу map.json
    $.getJSON("map.json", {}, function(data) {

        $.each(data.places, function(i, item) {
            $("#markers").append('<li><a href="#" rel="' + i + '">' + item.title + '</a></li>');
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lng),
                map: map,
                title: item.title
            });

            //Додаємо координати міток
            latlngbounds.extend(new google.maps.LatLng(item.lat, item.lng));
            arrMarkers[i] = marker;

            var infowindow = new google.maps.InfoWindow({
                content: "<h3>" + item.title + "</h3><p>" + item.description + "</p>"
            });

            arrInfoWindows[i] = infowindow;

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        });

        //Центруємо і масштабується карту так, щоб було видно всі мітки
        map.setCenter(latlngbounds.getCenter(), map.fitBounds(latlngbounds));
    });
}

$(function() {
    //Визначаємо карту (додаємо маркери, Балун і список з посиланнями)
    mapInit();

    //Живе відстеження події клікуа по посиланню
    $("#markers a").live("click", function() {
        var i = $(this).attr("rel");

        //Цей рядок коду, закриває всі відкриті Балун, для відкриття вибраного
        for (x = 0; x < arrInfoWindows.length; x++) {
            arrInfoWindows[x].close();
        }
        arrInfoWindows[i].open(map, arrMarkers[i]);
    });
});
