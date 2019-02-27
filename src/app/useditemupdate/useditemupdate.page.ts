import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, NavController, MenuController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { UploadpicService } from '../../services/uploadpic/uploadpic.service';
import { Upload } from '../../models/upload/upload';
import * as _ from 'lodash';
@Component({
  selector: 'app-useditemupdate',
  templateUrl: './useditemupdate.page.html',
  styleUrls: ['./useditemupdate.page.scss'],
})
export class UseditemupdatePage implements OnInit {

  salesTitle : any;
  itemTitle : any;
  itemPrice : any;
  itemContact : any;
  itemDetail : any;
  itemStatus : any;
  uploadDate : any;
  salesDetail : any;
  date : any;
  salesData:any[]=[];
  title:any;
  desc:any;
  items:any[]=[];
  selectedFiles1: FileList;
  selectedFiles2: FileList;
  selectedFiles3: FileList;

  currentUpload1: Upload;
  currentUpload2: Upload;
  currentUpload3: Upload;

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
    this.fs.collection('/useditems',ref=>ref.orderBy('createdAt', 'desc')).get().subscribe(res=>
      {
        res.forEach((doc:any)=>
      {
        this.items.push({
          itemtitle:doc.data().itemtitle,
          uploaddate :doc.data().uploaddate,
          itemprice : doc.data().itemprice,
          itemcontact : doc.data().itemcontact,
          detail : doc.data().detail,
          itemstatus : doc.data().itemstatus,
          // url1: doc.data().url1,
          // url2: doc.data().url2,
          // url3: doc.data().url3,
        })
        this.itemTitle = doc.data().itemtitle;
        this.uploadDate = doc. data().uploaddate;
        this.itemPrice = doc.data().itemprice;
        this.itemContact = doc.data().itemcontact;
        this.itemDetail = doc.data().detail;
        this.itemStatus = doc.data().itemstatus;
      });
      })
      console.log(this.items);
  }
  
  detectSalesFiles1(event:any){
    this.selectedFiles1 = event.target.files;
  }
  detectSalesFiles2(event:any){
    this.selectedFiles2 = event.target.files;
  }
  detectSalesFiles3(event:any){
    this.selectedFiles3 = event.target.files;
  }
// for usedItem
insertUsedItem(){
  let basePath:string="/useditems";
  // let file1 = this.selectedFiles1.item(0)
  // let file2 = this.selectedFiles2.item(0)
  // let file3 = this.selectedFiles3.item(0)

  // this.currentUpload1 = new Upload(file1);
  // this.currentUpload2 = new Upload(file2);
  // this.currentUpload3 = new Upload(file3);

  this.fs.collection(`${basePath}`).doc(`${this.itemTitle}`).update(
    {
    itemtitle : this.itemTitle,
    uploaddate : this.uploadDate, 
    itemprice : this.itemPrice,
    itemcontact : this.itemContact,
    detail : this.itemDetail,
    itemstatus : this.itemStatus
  }
  ).then(data=>
    {
      console.log("reach here with data: "+data);
        this.alert("For Information","Insertion successful");
        this.navCtl.navigateForward('/sales');
      console.log(data);
    //  this.uploadServ.pushUpload(this.currentUpload1,this.currentUpload2,this.currentUpload3,basePath,this.itemTitle);

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
