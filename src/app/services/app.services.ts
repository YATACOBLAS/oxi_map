import { PersonModel } from '../reg-oxi/model/person.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { appStorageServices } from './app.storage.services';

@Injectable({
  providedIn: 'root'
})
export class AppService {



  constructor(private firebase:AngularFirestore) {


   }

  saveInfoFirabase(person:PersonModel):Promise<any>{  
   return this.firebase.collection('findPerson').doc(person.id).set(person)
  }
  
  createIdFirabase(){
    return this.firebase.createId();
  }

  getInfoFirebase():Observable<any>{
    return this.firebase.collection('findPerson').snapshotChanges();
  }
  getInfoOneFirebase(id:string){
    return this.firebase.collection('findPerson').doc(id)?.get();
  }
  
  updateInfoOneFirebase(id:any,position:any){
    return this.firebase.collection('findPerson').doc(id)?.update({
      "lat":position.lat,
      "lng":position.lng
    });
  }
  calculateDistance(p1:any,p2:any){
    //formula de Haversine
    //form taken from https://stackoverflow.com/a/1502821/4241030
    var rad = function(x) {
      return x * Math.PI / 180;
    };
      var R = 6378137; 
      var dLat = rad(p2.lat - p1.lat);
      var dLong = rad(p2.lng - p1.lng);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      return d; 
  
  }


}
