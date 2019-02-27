import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, NavController, MenuController, LoadingController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { UploadpicService } from '../../services/uploadpic/uploadpic.service';
import { Upload } from '../../models/upload/upload';
import * as _ from 'lodash';
import { ThrowStmt } from '@angular/compiler';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';

@Component({
  selector: 'app-movieadmin',
  templateUrl: './movieadmin.page.html',
  styleUrls: ['./movieadmin.page.scss'],
})
export class MovieadminPage implements OnInit {
  movieTitle : any;
  movieVenue : any;
  movieTime : any;
  startDate : any;
  endDate : any;
  moviePrice : any;
  movieContact : any;
  movieTailor : any;
  date : any;
  movieData:any[]=[];
  title:any;
  desc:any;
  selectedFiles: FileList;
  currentUpload: Upload;
  movie:any[]=[];
  movieList: Array<any[]>;
  showaddnew : boolean = false;
  constructor(private fs : AngularFirestore,
    private altCtl : AlertController,
    private navCtl : NavController,
    private fstorage:AngularFireStorage,
    private datePicker: DatePicker,
    private uploadServ: UploadpicService,
    private menu:MenuController,
    public loadingController: LoadingController,
    private firebase: Firebase) { 
      this.presentLoading();
      this.fs.collection('/movies',ref=>ref.orderBy('createdAt', 'desc')).get().subscribe(res=>
        {
          res.forEach((doc:any)=>
        {
          this.movie.push({
            movietitle:doc.data().movietitle,
            venue:doc.data().venue,
            time : doc.data().time,
            startdate :doc.data().startdate,
            enddate : doc.data().enddate,
            price : doc.data().price,
            contact : doc.data().contact,
            tailor : doc.data().tailor,
            name: doc.data().name
          })
          // this.movieList.push(this.movie);
          console.log("movie data: "+this.movie);
          if(this.movie){
            console.log("up");
            this.loadingController.dismiss();      
          }
        });
        })
       
    }

  ngOnInit() {
  }

  openMenu(){
    this.menu.toggle('myMenu');
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
  pickDate(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      // androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      androidTheme : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date =>{
        let dateArray=date.toString().split(' ');
        this.startDate=dateArray[0]+" "+dateArray[1]+" "+dateArray[2]+" "+dateArray[3]
        err => console.log('Error occurred while getting date: ', err)
      }
    
      //console.log('Got date: ', date),
      
      
    );
  }
  pickEndDate(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => 
      {
        let dateArray=date.toString().split(' ');
        this.endDate=dateArray[0]+" "+dateArray[1]+" "+dateArray[2]+" "+dateArray[3]
        err => console.log('Error occurred while getting date: ', err)
      }
      
    );
  }
  goAddMore(){
    this.navCtl.navigateForward('/movieaddmore');
  }
  //for deleting the movie item
  goDelete(movietitle:any, name: any){
    this.presentAlertConfirm(movietitle, name)
  }

  deleteSure(movietitle:any,name:any){
    let basePath:string="/movies";
    this.fs.collection(`${basePath}`).doc(`${movietitle}`).delete().then(data=>
      {
          this.alert("For Information","Deletion successful");
          this.navCtl.navigateForward('/movies');
      }
      )
     this.fstorage.storage.ref(`${basePath}/${name}`).delete();
  }
  //for updating the item
  goEdit(movietitle : any){
    console.log(movietitle);
    this.navCtl.navigateForward('/movieupdate/'+movietitle);
  }

  async presentAlertConfirm(movietitle:any, name: any) {
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
            this.deleteSure(movietitle, name)
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
