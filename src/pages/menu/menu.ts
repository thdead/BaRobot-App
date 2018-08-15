import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage} from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor( private homePage: HomePage) {
    
  }

  goToSlide(num,speed) {
    this.homePage.goToSlide(num,speed);
  }

  goToConf() {
    this.goToSlide(3,1);
    this.homePage.slides.lockSwipes(true);
  }

}
