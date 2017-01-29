import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';



@Component({
  selector: 'page-proveedordetalle',
  templateUrl: 'proveedordetalle.html'
})
export class ProveedordetallePage {

  user = {id:''};
  nombre;
  direccion;
  horario;


  constructor(public navCtrl: NavController
    , public platform: Platform
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public http: Http
    , public storage: Storage
  ) { }

  ionViewDidLoad() {
    console.log('Hello ProveedordetallePage Page');
  }

  ngAfterViewInit() {
    this.autenticacion();
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
          this.navCtrl.push(ProveedordetallePage);
        }

      });

  }



}
