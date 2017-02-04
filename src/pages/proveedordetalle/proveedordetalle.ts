import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { FileChooser } from 'ionic-native';
import { Transfer } from 'ionic-native';


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
  nombreimagen = "";


  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public http: Http
    , public storage: Storage
    , private zone: NgZone
  ) { }

  ionViewDidLoad() {
    console.log('Hello ProveedordetallePage Page');
  }

  ngAfterViewInit() {
    this.autenticacion();
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
        this.nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=" + this.user.id + ".jpg";
        loading.dismiss();
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: 'url',
          subTitle: 'error inesperado',
          buttons: ['OK']
        });
        alert.present();
      })
  }


  buscarimagen() {
    FileChooser.open().then(uri => //this.user.id
    {
      this.nombreimagen = uri;
    }
    );
  }

  autenticacion() {
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
          }

        });

    });
  }

  guardar() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);


    var link = 'https://movilapp-xxangusxx.c9users.io/ProveedorGuardar';
    var datos = JSON.stringify({ user_id: this.user.id, nombre: this.nombre, direccion: this.direccion, horario: this.horario });
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
          this.upload(this.nombreimagen);
          this.navCtrl.push(ProveedordetallePage);
        }

      });

  }



}
