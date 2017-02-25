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
import { PerfilproveedorPage } from '../perfilproveedor/perfilproveedor';


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
  searchQuery: string = '';
  private marcadores = false;

  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public http: Http
  ) {
    console.log('constructor');
    this.platform.ready().then(() => {
      console.log('constructor platform');

    });
  }

  ionViewDidEnter() {
    this.proveedorlistar();
  }

  onPageWillLeave() {
    /*this.map.clear();
    this.map.off();
    this.map.on();*/
    console.log('nos vamos');
    //this.map.clear();
    //this.map.refreshLayout();
  }


  getCurrentPosition() {
    if (this.marcadores) {
      //this.map.clear();
      console.log('se limpio');
    }
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
      this.marcadores = true;
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

  removemarkers() {
    this.map.remove();
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
            else {
              this.getCurrentPosition();
            }

          });

      });

  }

  ngAfterViewInit() {
  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.proveedorlistar();
    });
  }

  ir(id) {
    //this.removemarkers();
    this.navCtrl.push(PerfilproveedorPage, { proveedor_id: id });    
  }

  getItems(ev: any) {
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.proveedores = this.proveedores.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.map.clear();
      this.mapearproveedores();
    }
    else {
      this.proveedorlistar();
      //this.mapearproveedores();
    }
  }

}
