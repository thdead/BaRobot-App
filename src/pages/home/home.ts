import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular/index';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild(Slides) slides: Slides;

  listOfDrink: Array<any> = [
    {name:'Whisky'},
    {name:'Tequila'},
    {name:'Vodka'},
    {name:'Gin'},
    {name:'Rhum'},
    {name:'Rhum Blanc'},
    {name:'Rhum Brun'},

    {name:'Vin Blanc'},
    
    {name:'Jus de citron'},
    {name:'Tonic'},
    {name:'Limonade'},
    {name:'Jus de citron vert'},
    {name:'Coca-Cola'},
    {name:'Eau Pétillante'},
    {name:'Sucre de Canne'},
    {name:"Jus D'orange"},
    {name:"Jus De Pomme"},
    {name:"Grenadine"},
  ];

  listOfColor: Array<any> = [
    {name:'Orange'      , value:'org'},
    {name:'Vert clair'  , value:'vrtCl'},
    {name:'Vert foncé'  , value:'vrtFc'},
    {name:'Turquoise'   , value:'turq'},
    {name:'Brun'        , value:'brn'},
    {name:'Blanc'       , value:'blnc'},
    {name:'Jaune'       , value:'jne'},
    {name:'Rouge'       , value:'rge'},
    {name:'Blanc Cassé' , value:'blnKc'},
    {name:'Rose'        , value:'rse'},
    {name:'Transparent' , value:'trpnt'},
  ];

  bottleLoad: Array<any> = [
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'}
  ];

  constructor( private storage: Storage) {

  }

  ngAfterViewInit() {
      this.slides.lockSwipeToNext(true);
      this.getAll();
  }

  public goToSlide(num,speed) {
    this.slides.lockSwipeToNext(false);
    this.slides.slideTo(num, speed);
    this.slides.lockSwipeToNext(true);
  }

  getAll() {
    this.storage.get('lod').then(
      value => {
        if (value === null) {
          console.log('first save : listOfDrink')
          this.save('lod', this.listOfDrink);
        } else {
          this.listOfDrink = value;
        }
      }
    );
    this.storage.get('loc').then(
      value => {
        if (value === null) {
          console.log('first save : listOfColor')
          this.save('loc', this.listOfColor);
        } else {
          this.listOfColor = value;
        }
      }
    );
    this.storage.get('bl').then(
      value => {
        if (value === null) {
          console.log('first save : bottleLoad')
          this.save('loc', this.bottleLoad);
        } else {
          this.bottleLoad = value;
        }
      }
    );
  }

  saveAll() {
    this.save('lod' , this.listOfDrink);
    this.save('loc' , this.listOfColor);
    this.save('bl'  , this.bottleLoad);
    console.log('Save Done');
  }

  save(name, value) {
    this.storage.set(name, value);
  }


}
