import { AppService } from '../services/app.services';
import { PersonModel } from './model/person.model';
import { ModalmapComponent } from './modalmap/modalmap.component';
import { ModalController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { appStorageServices } from '../services/app.storage.services';

@Component({
  selector: 'app-reg-oxi',
  templateUrl: './reg-oxi.page.html',
  styleUrls: ['./reg-oxi.page.scss'],
})
export class RegOxiPage implements OnInit {
  form:PersonModel={
    names:'',
    avatar:'',
    lng:0,
    lat:0
  };
  idStorage:any;
 data={};
 
  positionComplet:0;
  constructor(private modalController:ModalController,
    private toast:ToastController,
    private _servicesOxiMap:AppService,
    private _storageServices:appStorageServices) { 
     
     }

ngOnInit() {
    this.getIdStorage()
} 
  
getIdStorage(){
   this._storageServices.getStorage('idFire').then(res=>{ this.idStorage=res}).catch(err=>{console.log(err)});
     
}

  async showMap(){
    
      this._servicesOxiMap.getInfoFirebase()
      .subscribe(data=>{

            data.filter((ele:any)=>{
                if(ele.payload.doc.data().id==this.idStorage) {
                   this.data=ele.payload.doc.data();
                  };
            })
            console.log(this.data);
            
      });
        let position:{
          lat:-2.898116,
          lng:-78.9995814999999
        }
    const modal= await  this.modalController.create({
        component:ModalmapComponent,
        mode:'ios',
        //Cerrar al deslizar hacia abajo
        swipeToClose:true,
        cssClass:'my-custom-class',
        //enviando parametros de entrada
        // componentProps:{position}
      })
     await modal.present();
      const {data} =await modal.onWillDismiss();
      if(data){
        console.log(data);
        this.form.lat=data.pos.lat;
        this.form.lng=data.pos.lng;
      }
    }
   async showToast(){
     const toast= await this.toast.create({
       message:'REGISTRO EXITOSO',
       duration:2500,
       position:'top',
       color:'success'
     });
     toast.present();
   }

    SaveForm(){
      const id= this._servicesOxiMap.createIdFirabase();
        this.form.id=id;
      this._servicesOxiMap.saveInfoFirabase(this.form).then(()=>{

       this.showToast();
       this.form.avatar='';
       this.form.lat=0;
       this.form.lng=0;
       this.form.names='';
       this._storageServices.set("idFire",this.form.id);
       this.form.id='';

     }).catch(err=>{console.log(err)})
    }
}
