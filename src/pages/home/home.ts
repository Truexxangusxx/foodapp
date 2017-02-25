import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { PerfilPage } from '../perfil/perfil';
import { Storage } from '@ionic/storage';
import { MapaPage } from '../mapa/mapa';
import { MapaproveedorPage } from '../mapaproveedor/mapaproveedor';
import { GustosPage } from '../gustos/gustos';
import { FamiliaPage } from '../familia/familia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registroPage = RegistroPage;

  contenido = {};
  email = "";
  password = "";
  proveedor = {};

  constructor(public navCtrl: NavController
    , public loadingCtrl: LoadingController
    , public http: Http
    , public alertCtrl: AlertController
    , public storage: Storage
    , public platform: Platform
  ) {

  }


  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.storage.get('token').then((val) => {
        console.log('Your token is', val);

        let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
        loading.present(loading);


        var link = 'https://movilapp-xxangusxx.c9users.io/auth_token?token={' + val + '}';
        var datos = JSON.stringify({});
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(link, datos, { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            this.contenido = data;
            console.log(this.contenido);
            console.log(this.contenido['user']);

            loading.dismiss();

            if (this.contenido['error']) {
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: this.contenido['msg'],
                buttons: ['OK']
              });
              alert.present();
            }
            else {

              if (this.contenido['user'].tipo != null) {
                if (this.contenido['user']['gustos'].length > 0) {
                  if (this.contenido['user'].tipo == 1) {
                    this.navCtrl.push(MapaPage);
                  }
                  if (this.contenido['user'].tipo == 2) {
                    this.navCtrl.push(MapaproveedorPage);
                  }
                }
                else {
                  if (this.contenido['user'].tipo == 1) {
                    this.navCtrl.push(GustosPage);
                  }
                  if (this.contenido['user'].tipo == 2) {
                    this.proveedorporusuario(this.contenido['user'].id);
                  }
                }
              }
              else {
                this.navCtrl.push(PerfilPage);
              }
            }

          });

      });
    });
  }


  ingresar() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);


    var link = 'https://movilapp-xxangusxx.c9users.io/auth_login';
    var datos = JSON.stringify({ email: this.email, password: this.password });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(datos);

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.contenido = data;
        console.log(this.contenido);
        this.storage.set('token', this.contenido['token']);


        loading.dismiss();

        if (this.contenido['error']) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: this.contenido['msg'],
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          if (this.contenido['user'].tipo != null) {
            if (this.contenido['user']['gustos'].length > 0) {
              if (this.contenido['user'].tipo == 1) {
                this.navCtrl.push(MapaPage);
              }
              if (this.contenido['user'].tipo == 2) {
                this.navCtrl.push(MapaproveedorPage);
              }
            }
            else {
              if (this.contenido['user'].tipo == 1) {
                this.navCtrl.push(GustosPage);
              }
              if (this.contenido['user'].tipo == 2) {
                this.proveedorporusuario(this.contenido['user'].id);
              }
            }
          }
          else {
            this.navCtrl.push(PerfilPage);
          }
        }

      });

  }

  validarusuario(user_id) {

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
          if (this.proveedor['gusto_id'] != null) {
            this.navCtrl.push(MapaproveedorPage);
          }
          else {
            this.navCtrl.push(FamiliaPage);
          }
        }

      });
  }



}
