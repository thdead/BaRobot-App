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

  ngAfterViewInit() {
      // this.slides.lockSwipes(true);
      this.slides.lockSwipeToNext(true);
  }

  public goToSlide(num,speed) {
    // this.slides.lockSwipes(false);
    this.slides.lockSwipeToNext(false);
    this.slides.slideTo(num, speed);
    this.slides.lockSwipeToNext(true);
    // this.slides.lockSwipes(true);
  }

}
