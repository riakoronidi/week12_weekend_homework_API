const app = function(){
  const url = "http://api.citybik.es/v2/networks";
  makeRequest(url, requestComplete);
}

const requestComplete = function(){
  if(this.status !== 200) return;
  const jsonString = this.responseText;
  const bikes = JSON.parse(jsonString);

  // populateList(bikes);
  initialize(bikes);
};

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
};

//not required but keeping it in
// const populateList = function(bikes){
//   // console.log(bikes.networks);
//   const ul = document.getElementById('data-list');
//
//   for(element of bikes.networks){
//     const li = document.createElement('li');
//     const ol = document.createElement('ol');
//     li.innerText = element.name;
//     ol.innerText = element.location.country;
//     ul.appendChild(li);
//     li.appendChild(ol);
//   }
// };

const initialize = function(bikes){
  var markerArray = []; //store marker in array
  var contentArray = [];
  var infoArray = [];
  var container = document.getElementById('main-map');
  var firstpoint = {lat: 55.8571, lng: -4.2445};
  var zoom = 1;
  var content = "some location";

  var map = new google.maps.Map(container, {
    center: firstpoint,
    zoom: zoom
  })

  for(i=0; i < bikes.networks.length; i++){
    var centerNew = new google.maps.LatLng(bikes.networks[i].location.latitude, bikes.networks[i].location.longitude);

    marker = new google.maps.Marker({
      position: centerNew,
      map: map
    })

    markerArray.push(marker);

    markerArray[i].index = i; //add index property

    content = "<b>" + bikes.networks[i].location.city + ", " + bikes.networks[i].location.country + "</b> <br/>" + bikes.networks[i].name;

    contentArray.push(content);

    var info = new google.maps.InfoWindow({
      content: contentArray[i]
    })

    infoArray.push(info);

    google.maps.event.addListener(markerArray[i], 'click', function() {
      infoArray[this.index].open(map,markerArray[this.index]);
      map.panTo(markerArray[this.index].getPosition());
    });

  }

}
// window.addEventListener('DOMContentLoaded', initialize);

window.addEventListener('load', app);
