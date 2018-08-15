import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from './../pages/menu/menu';
import { ConfigPage } from './../pages/config/config';
import { BluetoothPage } from './../pages/bluetooth/bluetooth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ConfigPage,
    BluetoothPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ConfigPage,
    BluetoothPage
  ],
  providers: [
    HomePage,
    BluetoothPage,
    BluetoothSerial,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
