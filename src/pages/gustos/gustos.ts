import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { HomePage } from '../home/home';
import { MapaproveedorPage } from '../mapaproveedor/mapaproveedor';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Gustos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gustos',
  templateUrl: 'gustos.html'
})
export class GustosPage {

  gustos = [];
  user = { id: '' };

  constructor(public navCtrl: NavController
    , public http: Http
    , public alertCtrl: AlertController
    , public storage: Storage
  ) {




    storage.get('token').then((val) => {

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

    })


    var link = 'https://movilapp-xxangusxx.c9users.io/GustosListar';
    var datos = JSON.stringify({});
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.gustos = data["gustos"];

        if (data['error']) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: "Ocurrio un error inesperado",
            buttons: ['OK']
          });
          alert.present();
        }


      });


  }



  guardar() {
    console.log(this.user);
    var link = 'https://movilapp-xxangusxx.c9users.io/GustosAgregar';
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    for (let entry of this.gustos) {
      var datos = JSON.stringify({ user_id: this.user.id, gusto_id: entry['id'] });
      if (entry['ok']) {
        this.http.post(link, datos, { headers: headers })
          .map(res => res.json())
          .subscribe(data => {

            if (data['error']) {
              console.log(data['msg']);
            }
            else {

            }

          });
      }
    }
    if (this.user["tipo"] == "2") {
      this.navCtrl.push(MapaproveedorPage);
    }
    else {
      this.navCtrl.push(MapaPage);
    }

  }



  ionViewDidLoad() {
    console.log('Hello GustosPage Page');
  }

}
