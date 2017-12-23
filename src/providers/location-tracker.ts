import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTracker {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  public active: boolean = false;;

  public myMarker:any;

  constructor(public zone: NgZone,
      public backgroundGeolocation: BackgroundGeolocation,
      public geolocation: Geolocation) {

  }

  startTracking(map: any, google: any) {
    // Background Tracking

    this.active = true;

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      //console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.addMarker(map, google);

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      //console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.myMarker.setPosition( { lat: this.lat, lng: this.lng });
      });

    });
  }

  stopTracking() {
    this.active = false;

    //console.log('stopTracking');

    this.lat = 0;
    this.lng = 0;

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

  addMarker(map: any, google: any) {
    this.myMarker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });

    let content = `<h4>Estas Aquí</h4>`;

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(this.myMarker, 'click', () => {
      infoWindow.open(map, this.myMarker);
    });
  }

}
