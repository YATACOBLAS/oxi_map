import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
  })
export class appStorageServices{
  private _storage: Storage | null = null;
  idStorage:any;

    constructor(private storage:Storage){
        this.init();

    }
    
     getIdStorage(){
       return this.idStorage;
     }
   
        async init(){
         const storage= await this.storage.create();
            this._storage=storage;
        }
        set(key:string,value:any){
           this._storage?.set(key,value);
        }
         async getStorage(key:string):Promise<void>{
           
            return await this._storage?.get(key);
            
        }
         async lengthStorage():Promise<number>{
            return  await this._storage?.length();
           }

  }