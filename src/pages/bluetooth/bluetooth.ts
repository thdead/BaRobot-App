import { HomePage } from './../home/home';
import { Component, Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Cette classe gère la connectivité Bluetooth
 * @author Juan Lozoya <jlozoya1995@gmail.com>
 * @see [Bluetooth Serial](https://ionicframework.com/docs/native/bluetooth-serial/)
 */
@Injectable()
@Component({
  selector: 'bluetooth-page',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage {

  toSend: string = "";
  listOfDevices: Array<any> = [];
  tempArray: Array<any>;
  loading;
  isConnected:Boolean = false;
  connectedDeviceName: string = "";
  connectedDeviceId: string = "";
  
  listOfDrink: Array<any> = [];

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private loadingCtrl: LoadingController, private home:HomePage) { }


  /**
   * Lors de la fermeture de l'application, il s'assure que la connexion Bluetooth est fermée.
   */
  public ngOnDestroy() {
    this.bluetoothSerial.disconnect();
  }


 /**
 * ------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------------
 */

  // test si le bluetooth est activé
  public isBtEnable() {
    this.bluetoothSerial.isEnabled().then(
      success =>{
        this.createToast("Bluetooth is enabled");
        this.isConnectedTo();
      },
      fail => {
        this.connectedDeviceName = '';
        this.connectedDeviceId = '';
        this.isConnected = false;
        this.createToast("Bluetooth is *not* enabled");
        this.alertBluetooth();
      }
    );
  }

  // alerte pour demander d'activer le bluetooth
  alertBluetooth() {
    let alert = this.alertCtrl.create({
      title: 'Bluetooth',
      message: 'Voulez vous activer le Bluetooth ?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.enableBluetooth();
          }
        },
        {
          text: 'Non',
          handler: () => {
            console.log('Close');
          }
        }
      ]
    });
    alert.present();
  }

  // active le bluetooth
  enableBluetooth() {
    this.bluetoothSerial.enable().then(
      success =>{
        this.createToast("Bluetooth is now enabled");
      },
      fail => {
        this.createToast("The user did *not* enable Bluetooth");
      }
    );
  }

  // cherche les périphériques disponibles
  foundBluethooth(){
    this.startLoaderBt('Recherche de périphériques Bluetooth...');
    this.bluetoothSerial.isEnabled().then(
      success =>{
        this.createToast("Bluetooth is enabled");
        this.createToast("Loading Bluetooth Devices");
        this.bluetoothSerial.discoverUnpaired().then(
          success => {
            if (success.length > 0) {
              this.listOfDevices = success;
              this.createToast("Bluetooth Devices are loaded");
              this.stopLoaderBt();
              this.alertBluetoothConnect();
            } else {
              this.stopLoaderBt();
              this.createToast('Aucun appareil trouvé');
            }
            
          }
        );
      },
      fail => {
        this.stopLoaderBt();
        this.createToast("Bluetooth is *not* enabled");
      }
    );
  }

  // alert avec la liste des périphérique bluetooth 
  alertBluetoothConnect() {
    let tempArray:Array <any> = [];
    this.listOfDevices.forEach(
      device => {
        tempArray.push({type:'radio',label: device.name + ' (' + device.id + ')',value:device})
      }
    );

    let alert = this.alertCtrl.create({
      title: 'Bluetooth',
      message: 'Selectionner le périphérique..',
      inputs : tempArray,
      buttons : [
      {
          text: "Quitter",
          handler: data => {
          console.log("cancel clicked");
          }
      },
      {
          text: "Connecter",
          handler: data => {
            this.connectedDeviceName = data.name;
            this.connectedDeviceId = data.id;

            this.createToast("Radio button selected : " + data.id);
            this.connectTo(data.id);
          }
      }]});
      alert.present();
  }

  connectTo(id) {
    this.startLoaderBt('Connexion au périphérique en cours...');
    this.bluetoothSerial.connect(id).subscribe(
      succes => {
        this.createToast('connected');
        this.isConnectedTo();
        this.stopLoaderBt();
      },
      fail => {
        this.createToast(`Erreur de connexion: ${JSON.stringify(fail)}`);
        this.stopLoaderBt();
      }
    );
  }

  isConnectedTo(){
    this.bluetoothSerial.isConnected().then(
      succes => {
        this.isConnected = true;
        this.createToast('Device connected, status : ' + succes);
      },
      failure => {
        this.connectedDeviceName = '';
        this.connectedDeviceId = '';
        this.isConnected = false;
        this.createToast('No device connected');
        this.foundBluethooth();
      }
    );
  }

  /**
   * ------------------------------------------------------------------------------------------------------------------------------
  **/

  sendMessage() {
    this.bluetoothSerial.isConnected().then(
      succes => {
        this.createToast("Msg to send : " + this.toSend);
        this.bluetoothSerial.write(this.toSend).then( 
          success =>{
            this.createToast("Msg Send");
          },
          failure => {
            this.createToast("Msg fail, can't send");
          }
        );
        this.toSend = '';
      },
      fail => {
        this.createToast("You can't send message if you are not connected");
        this.toSend = '';
      }
    ); 
  }

  generateString(){
    this.toSend = 'B';
    this.listOfDrink.forEach(
      dose => {
        this.toSend += dose.position + ";"
      }
    );
   }
  

  /**
   * ------------------------------------------------------------------------------------------------------------------------------
  **/

 fillGlass(bottle){
  if(this.listOfDrink.length == 8){
    return;
  }
  this.listOfDrink.push(
    {
      name:this.home.bottleLoad[bottle].name,
      color:this.home.bottleLoad[bottle].color,
      position: bottle
    }
  );
  this.generateString();
 }

 drainGlass(pos){
   this.listOfDrink.splice(pos,1);
   this.generateString();
 }


  /**
   * ------------------------------------------------------------------------------------------------------------------------------
  **/

  // créer un loader
  startLoaderBt(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });

    this.loading.present();
  }
  // supprime le loader
  stopLoaderBt() {
    this.loading.dismiss();
  }

  // créer un toast
  createToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}