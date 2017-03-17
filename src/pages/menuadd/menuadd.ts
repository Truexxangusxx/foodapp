import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Headers, RequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MenuproveedorPage } from '../menuproveedor/menuproveedor';
import { FileChooser } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-menuadd',
  templateUrl: 'menuadd.html'
})
export class MenuaddPage {

  menu = { id: 0, nombre: "", precio: "", descripcion: "" };
  proveedor = { id: 0 };
  nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=noimg.jpg";
  user = { id: 0 };
  imagendespositivo = false;


  constructor(public navCtrl: NavController
    , private navParams: NavParams
    , public http: Http
    , public storage: Storage
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController
  ) {


  }

  ionViewDidLoad() {
    console.log('Hello MenuaddPage Page');
    this.autenticacion();

  }

  obtenermenu() {
    console.log(this.navParams.get('menu_id'));
    var link = 'https://movilapp-xxangusxx.c9users.io/obtenermenu';
    var datos = JSON.stringify({ menu_id: this.navParams.get('menu_id') });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          this.menu = data['menu'];
          console.log(this.menu);
        }

      });
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
            this.proveedorporusuario(this.user.id);
          }

        });

    });
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
          if (this.navParams.get('menu_id') != null) {
            this.obtenermenu();
            this.nombreimagen = "https://movilapp-xxangusxx.c9users.io/buscarimagen?imagen=" + this.navParams.get('menu_id') + ".jpg&carpeta=" + this.proveedor.id;
          }
        }

      });
  }

  buscarimagen() {
    FileChooser.open().then(uri => //this.user.id
    {
      this.nombreimagen = uri;
      this.imagendespositivo = true;
    }
    );
  }


  upload(uri) {
    let loading = this.loadingCtrl.create({ content: 'Pensando ...' });
    loading.present(loading);

    const fileTransfer = new Transfer();
    var options: any;

    options = {
      fileKey: 'archivo',
      fileName: this.menu.id + '.jpg',
      headers: {}
    }
    fileTransfer.upload(uri, "https://movilapp-xxangusxx.c9users.io/SubirImagen?carpeta=" + this.proveedor.id, options)
      .then((data) => {
        loading.dismiss();
        this.navCtrl.push(MenuproveedorPage, { proveedor_id: this.proveedor.id });
      }, (err) => {
        this.alerta('error inesperado');
      });
  }

  alerta(texto) {
    let alert = this.alertCtrl.create({
      title: 'Mensaje',
      subTitle: texto,
      buttons: ['OK']
    });
    alert.present();
  }


  guardar() {
    var link = 'https://movilapp-xxangusxx.c9users.io/guardarmenu';
    var datos = JSON.stringify({ proveedor_id: this.proveedor.id, nombre: this.menu.nombre, precio: this.menu.precio, descripcion: this.menu.descripcion, menu_id: this.menu.id });
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(link, datos, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data['error']) {
          console.log('error inesperado');
        }
        else {
          this.menu = data['menu'];
          this.upload(this.nombreimagen);
        }
      });

  }

  eliminar() {
    console.log(this.menu.id);
    if (this.menu.id != 0) {
      var link = 'https://movilapp-xxangusxx.c9users.io/eliminarmenu';
      var datos = JSON.stringify({ menu_id: this.menu.id });
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(link, datos, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          if (data['error']) {
            console.log('error inesperado');
          }
          else {
            this.navCtrl.push(MenuproveedorPage, { proveedor_id: this.proveedor.id });
          }
        });
    }
  }

}
