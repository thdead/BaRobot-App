import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidPermissions } from '@ionic-native/android-permissions';


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
    BluetoothPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    AndroidPermissions,
    BluetoothPage,
    BluetoothSerial,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
