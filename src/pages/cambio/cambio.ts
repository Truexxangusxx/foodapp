import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { MapaPage } from '../mapa/mapa';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-cambio',
  templateUrl: 'cambio.html'
})
export class CambioPage {

  constructor(public navCtrl: NavController
    , public http: Http
    , public storage: Storage
    , public loadingCtrl: LoadingController
    , public toastCtrl: ToastController
  ) { }


  user = { id: '' };
  password;
  repassword;
  lastpassword;


  ionViewDidLoad() {
    console.log('Hello CambioPage Page');
    this.autenticacion();
  }


  mensaje(texto) {
    const toast = this.toastCtrl.create({
      message: texto,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'top'
    });
    toast.present();
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

  cambioclave() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);

    var link = 'https://movilapp-xxangusxx.c9users.io/cambioclave';
    var datos = JSON.stringify({ id: this.user.id, password: this.password, password_confirmation: this.repassword, lastpassword: this.lastpassword });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        loading.dismiss();

        if (data['error']) {
          this.mensaje(data['msg']);
        }
        else {
          this.mensaje('Su contraseña ha sido actualizada');
        }

      });

  }

  salir() {
    this.navCtrl.push(MapaPage);
  }





}
