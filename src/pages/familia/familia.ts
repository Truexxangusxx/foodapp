import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { MapaPage } from '../mapa/mapa';
import { HomePage } from '../home/home';
import { MapaproveedorPage } from '../mapaproveedor/mapaproveedor';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-familia',
  templateUrl: 'familia.html'
})
export class FamiliaPage {


  gustos = [];
  user = { id: '' };
  id;
  


  constructor(public navCtrl: NavController
    , public http: Http
    , public alertCtrl: AlertController
    , public storage: Storage
  ) { }

  ionViewDidLoad() {
    this.obtenerusuario();
    this.listargustos();
  }



  obtenerusuario() {
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

    })

  }
  listargustos() {
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

  guardar(){
    var link = 'https://movilapp-xxangusxx.c9users.io/ProveedorGuardar';
    var datos = JSON.stringify({ user_id: this.user['id'], gusto_id: this.id});
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(datos);
    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        if (data['error']) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: data['msg'],
            buttons: ['OK']
          });
          alert.present();
          console.log(data['msg']);
        }
        else {
          console.log('actualizado');
          this.navCtrl.push(MapaproveedorPage);
        }

      });

  }





}
