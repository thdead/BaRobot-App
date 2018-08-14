import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

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

  bottleLoad: Array<any> = 
  [
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'},
    {name:'Vide',color:'blc'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  edit(num) {
    
    this.listDeBoisson(num);
  }

  listDeBoisson(num) {
    let tempArray:Array <any> = [];
    this.listOfDrink.forEach(
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
            console.log(data)
            if(!data) {
              this.bottleLoad[num].name = 'Vide';
            } else {
              this.bottleLoad[num].name = data;
              this.listDeCouleurs(num);
            }
            
          }
      }]});
      alert.present();
  }

  listDeCouleurs(num) {
    let tempArray:Array <any> = [];
    this.listOfColor.forEach(
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
              this.bottleLoad[num].color = 'blc';
            } else {
              this.bottleLoad[num].color = data;
            }
            
          }
      }]});
      alert.present();
  }

}
