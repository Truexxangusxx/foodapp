import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import {HomePage} from '../home/home';
import {GustosPage} from '../gustos/gustos';

/*
  Generated class for the Perfil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {
  user={tipo:''};
  contenido={};

  constructor(public navCtrl: NavController
  ,public storage: Storage
  , public loadingCtrl: LoadingController
  , public http: Http
  , public alertCtrl: AlertController
  ) {

    storage.get('token').then((val) => {

      let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
      loading.present(loading);

      var link = 'https://movilapp-xxangusxx.c9users.io/auth_token?token={'+val+'}';
      var datos = JSON.stringify({ });
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(link, datos, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.contenido = data;

          loading.dismiss();

          if (this.contenido['error']) {
            this.navCtrl.push(HomePage);
          }
          else{
            this.user=this.contenido['user'];
          }

        });

    })





  }

  enviar(){

    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);

    var link = 'https://movilapp-xxangusxx.c9users.io/ActualizarTipoUsuario';
    var datos = JSON.stringify({user_id:this.user['id'], tipo:this.user['tipo'] });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(datos);

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.contenido = data;

        loading.dismiss();

        if (this.contenido['error']) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: this.contenido['msg'],
            buttons: ['OK']
          });
          alert.present();
        }
        else{
          this.navCtrl.push(GustosPage);
        }

      });

  }




  ionViewDidLoad() {
    console.log('Hello PerfilPage Page');
  }

}
