import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
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
  selector: 'page-ruta',
  templateUrl: 'ruta.html'
})
export class RutaPage {

  private map;
  private posicion;
  xlat;
  xlon;
  proveedor = { id: '', nombre: '', direccion: '', horario: '', lat: 0, lon: 0 };

  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public http: Http
    , private navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('Hello RutaPage Page');

    this.platform.ready().then(() => {
      this.obtenerproveedor();
    });

  }




  obtenerproveedor() {
    var link = 'https://movilapp-xxangusxx.c9users.io/ProveedorObtener';
    var datos = JSON.stringify({ id: this.navParams.get('proveedor_id') });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          this.proveedor = data['proveedor'];
          console.log(data['proveedor']);
          this.getCurrentPosition();
        }

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

    this.map = new GoogleMap('map3', {
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
    let punto = new GoogleMapsLatLng(this.proveedor.lat, this.proveedor.lon);
    let nombre = this.proveedor.nombre;
    this.setMarker(punto, nombre);
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



}
