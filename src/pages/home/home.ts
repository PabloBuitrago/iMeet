import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';

import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  data:any;

  latLng:any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController,
    public geolocation: Geolocation,
    public locationTracker: LocationTracker) {

  }

  start(){
    this.locationTracker.startTracking(this.map, google);
  }

  stop(){
    this.locationTracker.stopTracking();
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //this.addMarker();

    }, (err) => {
      console.log(err);
    });


  }

  // addMarker(){
  //   this.myMarker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: this.map.getCenter()
  //   });
  //
  //   let content = `<h4>Estas Aquí</h4>`;
  //
  //   this.addInfoWindow(this.myMarker, content);
  // }
  //
  // addInfoWindow(marker, content){
  //
  //   let infoWindow = new google.maps.InfoWindow({
  //     content: content
  //   });
  //
  //   google.maps.event.addListener(marker, 'click', () => {
  //     infoWindow.open(this.map, marker);
  //   });
  //
  // }
}
