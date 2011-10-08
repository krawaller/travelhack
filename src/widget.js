
// Vårt tokfestliga objekt

widget = new Object();

var datMap;
self.onload = function() {
datMap = new google.maps.Map(document.getElementById("googlemap"),
  {zoom: 4,
   center: new google.maps.LatLng(65, 10),
   mapTypeId: google.maps.MapTypeId.ROADMAP
  });

google.maps.event.addListener(datMap, 'bounds_changed', mapMoved);
}


function mapMoved(event) {
document.forms[0].position.value = event + "";
}