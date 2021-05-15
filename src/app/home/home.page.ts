import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { appStorageServices } from '../services/app.storage.services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router:Router,private _storageServices:appStorageServices) {
    
  }
      goMap(){
        this.router.navigate(['/oximap']);
      }
      goRegister(){
        this.router.navigate(['/reg-oxi']);
      }
}
