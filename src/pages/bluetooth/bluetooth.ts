import { Component, Injectable } from '@angular/core';
import { ToastController, AlertController, Refresher, LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";

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
  

  devices: Array<any> = [];
  mostrarSpiner = true;
  mensaje: string = "";
  conexion: ISubscription;
  conexionMensajes: ISubscription;
  reader: Observable<any>;
  rawListener;



  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private loadingCtrl: LoadingController) { }


  /**
   * Lors de la fermeture de l'application, il s'assure que la connexion Bluetooth est fermée.
   */
  public ngOnDestroy() {
    this.desconectar();
  }


 /**
 * ------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------------
 */

  // test si le bluetooth est activé
  isBtEnable() {
    this.bluetoothSerial.isEnabled().then(
      success =>{
        this.createToast("Bluetooth is enabled");
        this.foundBluethooth();
      },
      fail => {
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
    this.startLoaderBt();
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
        tempArray.push({type:'radio',label: device.name + ' (' + device.id + ')',value:device.id})
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
          this.createToast("Radio button selected : " + data);
          this.connectTo(data);
          }
      }]});
      alert.present();
  }

  connectTo(id) {
    this.bluetoothSerial.connect(id).subscribe(
      succes => {
        this.createToast('connected');
        this.isConnected = true;
      },
      fail => {
        this.createToast(`Erreur de connexion: ${JSON.stringify(fail)}`);
      }
    );
  }



  /**
   * ------------------------------------------------------------------------------------------------------------------------------
  **/

  // créer un loader
  startLoaderBt() {
    this.loading = this.loadingCtrl.create({
      content: 'Recherche de périphériques Bluetooth...'
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

  /**
   * ------------------------------------------------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------------------------------------------------
   * ------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * Recherchez les périphériques Bluetooth disponibles, évaluez s'il est possible d'utiliser la fonctionnalité
   * Bluetooth sur l'appareil.
   * @return {Promise<any>} Renvoie une liste des périphériques localisés.
   */
  buscarBluetooth(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(
        success =>{
          this.bluetoothSerial.discoverUnpaired().then(success => {
            if (success.length > 0) {
              resolve(success);
            } else {
              reject('Aucun appareil trouvé');
            }
          }).catch((error) => {
            console.log(`[1] Error: ${JSON.stringify(error)}`);
            reject('Bluetooth non disponible sur cette plateforme');
          });
        }, fail => {
          console.log(`[2] Error: ${JSON.stringify(fail)}`);
          reject("Bluetooth n'est pas disponible ou est désactivé");
        }
      );
    });
  }
  /**
   * Recherchez les périphériques bluetooth en faisant glisser l'écran vers le bas.
   * @param refresher
   */
  refreshBluetooth(refresher: Refresher) {
    console.log(refresher);
    if (refresher) {
      this.buscarBluetooth().then((successMessage: Array<Object>) => {
        this.devices = [];
        this.devices = successMessage;
        refresher.complete();
      }, fail => {
        this.presentToast(fail);
        refresher.complete();
      });
    }
  }
  /**
   * Vérifiez si vous êtes déjà connecté à un périphérique Bluetooth ou non.
   * @param seleccion Ce sont les données de l'élément sélectionné dans la liste
   */
  revisarConexion(seleccion) {
    this.bluetoothSerial.isConnected().then(
      isConnected => {
        let alert = this.alertCtrl.create({
          title: 'Reconnexion',
          message: 'Voulez-vous vous reconnecter à cet appareil?',
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Accepter',
              handler: () => {
                this.desconectar();
                this.conectar(seleccion.id).then(success => {
                  this.presentToast(success);
                }, fail => {
                  this.presentToast(fail);
                });
              }
            }
          ]
        });
        alert.present();
      }, notConnected => {
        let alert = this.alertCtrl.create({
          title: 'Se connecter',
          message: "Voulez-vous connecter l'appareil?",
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Accepter',
              handler: () => {
                this.conectar(seleccion.id).then(success => {
                  this.presentToast(success);
                }, fail => {
                  this.presentToast(fail);
                });
              }
            }
          ]
        });
        alert.present();
    });
  }
  /**
   * Un périphérique Bluetooth est conçu pour son identifiant.
   * @param id C'est l'identifiant du périphérique auquel vous voulez vous connecter
   * @return {Promise<any>} Renvoyer un message pour indiquer s'il a été connecté avec succès ou non.
   */
  conectar(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conexion = this.bluetoothSerial.connect(id).subscribe((data: Observable<any>) => {
        this.enviarMensajes();
        resolve("Connecté");
      }, fail => {
        console.log(`[3] Erreur de connexion: ${JSON.stringify(fail)}`);
        reject("Impossible de se connecter");
      });
    });
  }
  /**
   * Fermez le support pour la connexion avec un périphérique Bluetooth.
   */
  desconectar() {
    if (this.conexionMensajes) {
      this.conexionMensajes.unsubscribe();
    }
    if (this.conexion) {
      this.conexion.unsubscribe();
    }
  }
  /**
   * Il permet d'envoyer des messages texte en série lors de la connexion via Bluetooth.
   */
  enviarMensajes() {
    this.conexionMensajes = this.dataInOut(this.mensaje).subscribe(data => {
      let entrada = data.substr(0, data.length - 1);
      if (entrada != ">") {
        if (entrada != "") {
          console.log(`Entrée: ${entrada}`);
          this.presentToast(entrada);
        }
      } else {
        this.conexionMensajes.unsubscribe();
      }
      this.mensaje = "";
    });
  }
  /**
   * Définit le socket pour les communications série après la connexion à un périphérique
   * bluetooth.
   * @param message C'est le texte que vous souhaitez envoyer.
   * @returns {Observable<any>} Renvoyer le texte qui arrive via la connexion via
   * Bluetooth à l'appareil, en cas d'absence de connexion, un message indiquant:
   * _Vous n'êtes connecté à aucun périphérique Bluetooth_.
   */
  public dataInOut(message: string): Observable<any> {
    return Observable.create(observer => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        this.reader = Observable.fromPromise(this.bluetoothSerial.write(message))
          .flatMap(() => {
            return this.bluetoothSerial.subscribeRawData()
          })
          .flatMap(() => {
            return this.bluetoothSerial.readUntil('\n');   // <= délimiteur
          });
        this.reader.subscribe(data => {
          observer.next(data);
        });
      }, notConected => {
        observer.next("Vous êtes déconnecté ");
        observer.complete();
      });
    });
  }
  /**
   * Présenter une boîte de message.
   * @param {string} text Message à montrer
   */
  private presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}