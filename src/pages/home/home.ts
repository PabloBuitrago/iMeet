import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  lat:number;
  long:number;

  data:any;

  myMarker:any;
  latLng:any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      this.lat = Number(position.coords.latitude.toFixed(2));
      this.long = Number(position.coords.longitude.toFixed(2));

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker();

    }, (err) => {
      console.log(err);
    });


  }

  addMarker(){

    this.myMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>You are here!</h4>";

    this.addInfoWindow(this.myMarker, content);
  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

    //navigator.geolocation.watchPosition(this.watchSuccess, this.watchError, this.watchOptions);

  }

  watchSuccess(position) {


    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    console.log(this.lat);

    this.lat = Number(position.coords.latitude.toFixed(2));

    console.log(this.lat);

    this.long = Number(position.coords.longitude.toFixed(2));

    this.myMarker.setPosition(latLng);
  }

  watchError(){ }
  watchOptions(){ }
}
