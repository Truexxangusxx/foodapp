import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { LoadingController } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import {PerfilPage} from '../perfil/perfil';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html'
})
export class RegistroPage {

  contenido = {};
  nombre = "";
  email = "";
  password = "";
  repassword = "";

  constructor(public navCtrl: NavController, public userService: UserService, public loadingCtrl: LoadingController, public http: Http, public alertCtrl: AlertController) {

  }

  registrar() {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);


    var link = 'https://movilapp-xxangusxx.c9users.io/signup';
    var datos = JSON.stringify({ name: this.nombre, email: this.email, password: this.password, password_confirmation: this.repassword });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.contenido = data;
        console.log(this.contenido);


        loading.dismiss();

        if (this.contenido['error']) {
          console.log(this.contenido['messages']['email']);
          var lemail=this.contenido['messages']['email']!=undefined? this.contenido['messages']['email']+'-' : '';
          var lname=this.contenido['messages']['name']!=undefined? this.contenido['messages']['name']+'-' : '';
          var lpassword=this.contenido['messages']['password']!=undefined? this.contenido['messages']['password'] : '';
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: lemail+lname+lpassword,
            buttons: ['OK']
          });
          alert.present();
        }
        else{
          this.navCtrl.push(PerfilPage);
        }

      });

  }


  ionViewDidLoad() {
    console.log('tamos en registro');
  }
}
