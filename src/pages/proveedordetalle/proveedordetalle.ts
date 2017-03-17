import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { FileChooser } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { PerfilproveedorPage } from '../perfilproveedor/perfilproveedor';
import { MenuPage } from '../menu/menu';
import { MenuproveedorPage } from '../menuproveedor/menuproveedor';
import { ToastController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';


@Component({
  selector: 'page-proveedordetalle',
  templateUrl: 'proveedordetalle.html'
})
export class ProveedordetallePage {

  user = { id: '' };
  nombre;
  direccion;
  horario;
  uri;
  nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=noimg.jpg";
  proveedor = { id: 0, nombre: '', direccion: '', horario: '', lat: 0, lon: 0 };
  imagendespositivo=false;


  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public http: Http
    , public storage: Storage
    , private zone: NgZone
    , public toastCtrl: ToastController
    , private navParams: NavParams
  ) { }

  ionViewDidLoad() {
    console.log('Hello ProveedordetallePage Page');
  }

  ngAfterViewInit() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);
    this.autenticacion(this.mensaje('Se recomienda imagenes de 250x250 y en jpg', loading.dismiss()));
  }


  upload(uri) {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);

    const fileTransfer = new Transfer();
    var options: any;

    options = {
      fileKey: 'archivo',
      fileName: this.user.id + '.jpg',
      headers: {}
    }
    fileTransfer.upload(uri, "https://movilapp-xxangusxx.c9users.io/SubirImagen", options)
      .then((data) => {
        //this.nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=" + this.user.id + ".jpg";
        loading.dismiss();
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: 'url',
          subTitle: 'error inesperado',
          buttons: ['OK']
        });
        alert.present();
      });
  }


  buscarimagen() {
    FileChooser.open().then(uri => //this.user.id
    {
      this.nombreimagen = uri;
      this.imagendespositivo=true;
    }
    );
  }

  autenticacion(funcion) {
    this.storage.get('token').then((val) => {

      var link = 'https://movilapp-xxangusxx.c9users.io/auth_token?token={' + val + '}';
      var datos = JSON.stringify({});
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(link, datos, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {

          if (data['error']) {
            this.navCtrl.push(HomePage);
          }
          else {
            this.user = data['user'];
            this.proveedorporusuario(this.user.id);
            funcion;
          }

        });

    });
  }

  guardar() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);


    var link = 'https://movilapp-xxangusxx.c9users.io/ProveedorGuardar';
    var datos = JSON.stringify({ user_id: this.user.id, nombre: this.proveedor.nombre, direccion: this.proveedor.direccion, horario: this.proveedor.horario, lat: this.proveedor.lat, lon: this.proveedor.lon });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(datos);
    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        loading.dismiss();

        if (data['error']) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: data['msg'],
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          console.log('ingreso correctamente');
          if(this.imagendespositivo){
            this.upload(this.nombreimagen);
          }
        }

      });

  }

  mensaje(texto, funcion) {
    const toast = this.toastCtrl.create({
      message: texto,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'top'
    });
    toast.present();
    funcion;
  }

  alerta(texto) {
    let alert = this.alertCtrl.create({
      title: 'Mensaje',
      subTitle: texto,
      buttons: ['OK']
    });
    alert.present();
  }

  proveedorporusuario(id) {
    var link = 'https://movilapp-xxangusxx.c9users.io/proveedorporusuario';
    var datos = JSON.stringify({ user_id: id });
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
          this.nombreimagen = 'https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=' + this.proveedor.id + '.jpg';
        }

      });
  }

  gps() {
    Geolocation.getCurrentPosition().then(pos => {
      this.proveedor.lat = pos.coords.latitude;
      this.proveedor.lon = pos.coords.longitude;
      this.alerta('Presione guardar para actualizar su GPS');
    });
  }

vermenu(id) {
    this.navCtrl.push(MenuproveedorPage, { proveedor_id: id });
  }


}
