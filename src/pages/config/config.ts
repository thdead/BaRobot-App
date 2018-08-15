import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor( private alertCtrl: AlertController,public home: HomePage) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  save() {
    this.home.saveAll();    
    this.home.slides.lockSwipes(false);
    this.home.goToSlide(1,1);
  }

  listDeBoisson(num) {
    let tempArray:Array <any> = [];
    this.home.listOfDrink.forEach(
      drink => {
        tempArray.push({type:'radio',label: drink.name ,value:drink.name})
      }
    );

    let alert = this.alertCtrl.create({
      title: 'Boissons',
      message: 'Selectionner la boisson n°' + num+1,
      inputs : tempArray,
      buttons : [
      {
          text: "Quitter",
          handler: data => {
            console.log("cancel clicked");
          }
      },
      {
          text: "Choisir",
          handler: data => {
            if(!data) {
              this.home.bottleLoad[num].name = 'Vide';
            } else {
              this.home.bottleLoad[num].name = data;
              this.listDeCouleurs(num);
            }
          }
      }]});
      alert.present();
  }

  listDeCouleurs(num) {
    let tempArray:Array <any> = [];
    this.home.listOfColor.forEach(
      color => {
        tempArray.push({type:'radio',label: color.name ,value:color.value})
      }
    );

    let alert = this.alertCtrl.create({
      title: 'Couleur',
      message: 'Selectionner la Couleur n°' + num+1,
      inputs : tempArray,
      buttons : [
      {
          text: "Quitter",
          handler: data => {
          console.log("cancel clicked");
          }
      },
      {
          text: "Choisir",
          handler: data => {
            if(!data) {
              this.home.bottleLoad[num].color = 'blc';
            } else {
              this.home.bottleLoad[num].color = data;
            }
            this.home.saveAll();
          }
      }]});
      alert.present();
  }

}
