import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../pages/home/home';
import { BluetoothPage } from './../pages/bluetooth/bluetooth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = BluetoothPage;

  constructor(platform: Platform, statusBar: StatusBar) {

  }
}

