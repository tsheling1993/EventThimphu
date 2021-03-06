import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, NavController, MenuController,LoadingController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { UploadpicService } from '../../services/uploadpic/uploadpic.service';
import { Upload } from '../../models/upload/upload';
import * as _ from 'lodash';

@Component({
  selector: 'app-entertainment-admin',
  templateUrl: './entertainment-admin.page.html',
  styleUrls: ['./entertainment-admin.page.scss'],
})
export class EntertainmentAdminPage implements OnInit {
  rTitle : any;
  rVenue : any;
  rTime : any;
  rDate : any;
  rContact : any;
  rLink : any;
  date : any;
  rData:any[]=[];
  constructor(
    private fs : AngularFirestore,
    private altCtl : AlertController,
    private navCtl : NavController,
    private datePicker: DatePicker,
    private menu: MenuController,
    public loadingController: LoadingController
  ){
    this.loadData();
  }

  ngOnInit() {
    //for retriving the entertainment data from the database
  }

  loadData(){
    this.presentLoading();
    this.fs.collection('/t_entertainment',ref=>ref.orderBy('date', 'desc')).get().subscribe(res=>
      {
        res.forEach((doc:any)=>
        {
          this.rData.push({
            tilte : doc.data().tilte,
            venue : doc.data().venue,
            time : doc.data().time,
            date : doc.data().date,
            contact : doc.data().contract,
            detail : doc.data().detail,
          })
          if(this.rData){
            console.log("up");
            this.loadingController.dismiss();      
          }
        })
      })
      console.log(this.rData);
  }

  
  openMenu(){
    this.menu.toggle('myMenu');
  }
goAddMore(){
  this.navCtl.navigateForward('/entertainmentaddmore');
}

async alert(header:string,message:string)
{
  const alert=await this.altCtl.create({
    header:header,
    message: message,
    cssClass:'ok',
    buttons:['OK']
  });
  alert.present();
}
//for deleting the movie item
goDelete(tilte:any){
  this.presentAlertConfirm(tilte)
}

deleteSure(tilte){
  let basePath:string="/t_entertainment";
  this.fs.collection(`${basePath}`).doc(`${tilte}`).delete().then(data=>
    {
        this.alert("For Information","Deletion successful");
        this.navCtl.navigateForward('/musicordance');
    }
    )
}
//for updating the item
goEdit(tilte : any){
  console.log(tilte);
  this.navCtl.navigateForward('/entertainmentupdate/'+tilte);
  }

  async presentAlertConfirm(tilte) {
    const alert = await this.altCtl.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteSure(tilte)
          }
        }
      ]
    });

    await alert.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
     // message: 'Hellooo',
      duration: 15000,
      spinner: 'crescent',
      cssClass: 'loaderClass'
    });
    return await loading.present();
  }
}