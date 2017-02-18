import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';

@Component({
  selector: 'page-perfilproveedor',
  templateUrl: 'perfilproveedor.html'
})
export class PerfilproveedorPage {
  nombreimagen = "";
  proveedor = { id: '', nombre: '', direccion: '', horario: '', lat: '', lon: '' };
  onlike = true;
  likes = 0
  user = { tipo: '', id: '' };
  constructor(public navCtrl: NavController
    , private navParams: NavParams
    , public http: Http
    , public storage: Storage
    , public loadingCtrl: LoadingController
    , public platform: Platform
  ) {
  }

  ionViewDidLoad() {
    this.obtenerproveedor();
    console.log('Hello PerfilproveedorPage Page');
    this.nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=" + this.navParams.get('proveedor_id') + ".jpg";

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
          this.obtenerusuario()
        }

      });
  }


  likesuser() {

    var link = 'https://movilapp-xxangusxx.c9users.io/likes';
    var datos = JSON.stringify({ user_id: this.user.id, proveedor_id: this.proveedor.id });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(datos);
    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          console.log(data);
          this.likes = data["likes"];
          if (data["likeuser"] > 0) {
            this.onlike = true;
          }
          else {
            this.onlike = false;
          }
        }

      });
  }

  obtenerusuario() {
    this.storage.get('token').then((val) => {

      let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
      loading.present(loading);

      var link = 'https://movilapp-xxangusxx.c9users.io/auth_token?token={' + val + '}';
      var datos = JSON.stringify({});
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(link, datos, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {

          loading.dismiss();

          if (data['error']) {
            this.navCtrl.push(HomePage);
          }
          else {
            this.user = data['user'];
            this.likesuser();
          }

        });

    })
  }

  like() {
    /*
    if (this.onlike) {
      this.onlike = false;
      this.likes--;
    }
    else {
      this.onlike = true;
      this.likes++;
    }
    */
    console.log(this.onlike);
    if (this.onlike) {
      this.quitarlike();
    }
    else {
      this.darlike();
    }


  }

  darlike() {
    console.log("vamos a dar like");
    var link = 'https://movilapp-xxangusxx.c9users.io/ingresarlike';
    var datos = JSON.stringify({ user_id: this.user.id, proveedor_id: this.proveedor.id });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          this.likesuser();
          console.log("dimos like");
        }

      });
  }

  quitarlike() {
    var link = 'https://movilapp-xxangusxx.c9users.io/eliminarlike';
    var datos = JSON.stringify({ user_id: this.user.id, proveedor_id: this.proveedor.id });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          this.likesuser();
          console.log("quitamos like");
        }

      });
  }

  vermenu(id) {
    this.navCtrl.push(MenuPage, { proveedor_id: id });
  }

}
