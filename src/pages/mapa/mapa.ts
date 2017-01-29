import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapsLatLng,
  CameraPosition,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker
} from 'ionic-native';
import { Geolocation } from 'ionic-native';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';


@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  private map;
  private posicion;
  xlat;
  xlon;
  proveedores;


  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public http: Http
  ) {
      console.log('constructor');
    this.platform.ready().then(() => {
      console.log('constructor platform');
      this.proveedorlistar();
    });
  }


  getCurrentPosition() {
    Geolocation.getCurrentPosition()
      .then(position => {

        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        this.posicion = new GoogleMapsLatLng(lat, lng);

        this.loadMap();
      });
  }

  loadMap() {

    this.map = new GoogleMap('map', {
      'backgroundColor': '#00bdd1',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true,
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': this.posicion,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
      this.mapearproveedores();
    });


  }


  mapearproveedores() {
    for (let proveedor of this.proveedores) {
      let punto = new GoogleMapsLatLng(proveedor.lat, proveedor.lon);
      let nombre = proveedor.nombre;
      this.setMarker(punto, nombre);
    }
  }

  setMarker(punto, nombre) {
    let customMarker = "https://movilapp-xxangusxx.c9users.io/icon";
    let markerOptions: GoogleMapsMarkerOptions = {
      position: punto,
      title: nombre,
      icon: customMarker
    };

    this.map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        marker.showInfoWindow();
      });
  }

  proveedorlistar() {

    Geolocation.getCurrentPosition()
      .then(position => {
        this.xlat = position.coords.latitude;
        this.xlon = position.coords.longitude;

        var link = 'https://movilapp-xxangusxx.c9users.io/ProveedorListar';
        var datos = JSON.stringify({ lat: this.xlat, lon: this.xlon });
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(link, datos, { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            this.proveedores = data["lista"];
            console.log(data);

            if (data['error']) {
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: data["msg"],
                buttons: ['OK']
              });
              alert.present();
            }

          });

      });

  }

  ngAfterViewInit() {
    
  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.getCurrentPosition();
    });
  }

}
