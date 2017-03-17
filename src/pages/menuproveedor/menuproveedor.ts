import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MenuaddPage } from '../menuadd/menuadd';

/*
  Generated class for the Menuproveedor page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menuproveedor',
  templateUrl: 'menuproveedor.html'
})
export class MenuproveedorPage {

  user = { tipo: '', id: '' };
  listamenu = [];
  proveedor = { id: 0 };

  constructor(public navCtrl: NavController
    , private navParams: NavParams
    , public http: Http
    , public storage: Storage
    , public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('Hello MenuproveedorPage Page');
    this.obtenerproveedor();
    this.obtenerusuario;
  }


  ionViewDidEnter() {
    this.obtenerproveedor();
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
          }

        });

    })
  }

  listarmenu() {
    var link = 'https://movilapp-xxangusxx.c9users.io/listarmenu';
    var datos = JSON.stringify({ proveedor_id: this.proveedor.id });
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
          this.listamenu = this.proveedor["menus"];
          console.log(this.listamenu);
        }

      });
  }

  agregar() {
    this.navCtrl.push(MenuaddPage, { proveedor_id: this.proveedor.id });
  }

  ir(menu_id) {
    this.navCtrl.push(MenuaddPage, { menu_id: menu_id });
  }





}
