import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { UploadpicService } from '../../services/uploadpic/uploadpic.service';
import { Upload } from '../../models/upload/upload';
import * as _ from 'lodash';
@Component({
  selector: 'app-offerupdate',
  templateUrl: './offerupdate.page.html',
  styleUrls: ['./offerupdate.page.scss'],
})
export class OfferupdatePage implements OnInit {

  salesTitle : any;
  itemTitle : any;
  itemDetail : any;
  uploadDate : any;
  salesDetail : any;
  date : any;
  salesData:any[]=[];
  title:any;
  desc:any;
  sales:any[]=[];
  selectedFiles: FileList;
  currentUpload: Upload;
  constructor(private fs : AngularFirestore,
    private altCtl : AlertController,
    private navCtl : NavController,
    private datePicker: DatePicker,
    private uploadServ: UploadpicService,
    private menu: MenuController) { 
      this.loadData();
    }
  ngOnInit() {
    //for retriving useditem data
  }
  openMenu(){
    this.menu.toggle('myMenu');
  }
  loadData(){
    this.fs.collection('/sales',ref=>ref.orderBy('createdAt', 'desc')).get().subscribe(res=>
      {
        res.forEach((doc:any)=>
      {
        this.sales.push({
          salestitle:doc.data().salestitle,
          uploaddate :doc.data().uploaddate,
          detail : doc.data().detail,
        })
        this.salesTitle = doc.data().salestitle;
        this.uploadDate = doc.data().uploaddate;
        this.salesDetail = doc.data().detail;
      });
      })
      console.log(this.sales);
  }

  detectSalesFiles(event:any){
    this.selectedFiles = event.target.files;
  }

  insertFs(){
    let basePath:string="/sales";
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.fs.collection(`${basePath}`).doc(`${this.salesTitle}`).set(
      {
      salestitle : this.salesTitle,
      uploaddate : this.uploadDate, 
      detail : this.salesDetail,
    }
    ).then(data=>
      {
        console.log("reach here with data: "+data);
          this.alert("For Information","Insertion successful");
          this.navCtl.navigateForward('/sales');
        console.log(data);
        this.uploadServ.pushUpload1(this.currentUpload,basePath,this.salesTitle);
      }
      )
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
        this.uploadDate=dateArray[0]+" "+dateArray[1]+" "+dateArray[2]+" "+dateArray[3]
        err => console.log('Error occurred while getting date: ', err)
      }
    
      //console.log('Got date: ', date),
    );
  }



}
