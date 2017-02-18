import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  user = { tipo: '', id: '' };
  listamenu = [];
  proveedor = {};

  constructor(public navCtrl: NavController
    , private navParams: NavParams
    , public http: Http
    , public storage: Storage
    , public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    console.log('Hello MenuPage Page');
    console.log(this.navParams.get('proveedor_id'));
    this.obtenerproveedor();
    this.obtenerusuario;

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
    var datos = JSON.stringify({proveedor_id: this.proveedor});
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
          this.listamenu=this.proveedor["menus"];
          console.log(this.listamenu);          
        }

      });
  }



}
