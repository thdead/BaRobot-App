import { MenuPage } from './../menu/menu';
import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular/index';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController) {

  }

  public goToSlide(num) {
    this.slides.slideTo(num, 1000);
  }

}
