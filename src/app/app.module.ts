import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegistroPage } from '../pages/registro/registro';
import { PerfilPage } from '../pages/perfil/perfil';
import { GustosPage } from '../pages/gustos/gustos';
import { MapaPage } from '../pages/mapa/mapa';
import { MapaproveedorPage } from '../pages/mapaproveedor/mapaproveedor';
import { UserService } from '../providers/user-service';
import { Storage } from '@ionic/storage';
import { ProveedordetallePage } from '../pages/proveedordetalle/proveedordetalle';
import { PerfilproveedorPage } from '../pages/perfilproveedor/perfilproveedor';
import { MenuPage } from '../pages/menu/menu';
import { RutaPage } from '../pages/ruta/ruta';
import { FamiliaPage } from '../pages/familia/familia';
import { MenuproveedorPage } from '../pages/menuproveedor/menuproveedor';
import { MenuaddPage } from '../pages/menuadd/menuadd';
import { CambioPage } from '../pages/cambio/cambio';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistroPage,
    PerfilPage,
    GustosPage,
    MapaPage,
    MapaproveedorPage,
    ProveedordetallePage,
    PerfilproveedorPage,
    MenuPage,
    RutaPage,
    FamiliaPage,
    MenuproveedorPage,
    MenuaddPage,
    CambioPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistroPage,
    PerfilPage,
    GustosPage,
    MapaPage,
    MapaproveedorPage,
    ProveedordetallePage,
    PerfilproveedorPage,
    MenuPage,
    RutaPage,
    FamiliaPage,
    MenuproveedorPage,
    MenuaddPage,
    CambioPage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, UserService, Storage]
})
export class AppModule {}
