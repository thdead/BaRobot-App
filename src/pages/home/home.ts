import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular/index';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, private androidPermissions: AndroidPermissions) {

  }

  ngAfterViewInit() {
      // this.slides.lockSwipes(true);
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
  }

  public goToSlide(num,speed) {
    // this.slides.lockSwipes(false);
    this.slides.slideTo(num, speed);
    // this.slides.lockSwipes(true);
  }

}
