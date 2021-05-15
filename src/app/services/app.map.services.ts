import { Injectable } from '@angular/core';
//para que no halla error al compilar la aplicacion
declare var google:any;
@Injectable({
  providedIn: 'root'
})
export class AppMapServices {

  apikey='AIzaSyC7llAR9lRjVud76kKQRVYH1FocrtwZ9bM';
  //para verificar si el mapa esta cargado o no 
  mapsLoaded=false;

  constructor() { }

  init(renderer:any,document:any): Promise<any>{

    return new Promise((resolve) => {
        if(this.mapsLoaded){
          console.log('google is preview loaded');
          resolve(true);
          return;
        }      

        const script= renderer.createElement('script');
        script.id="oxiMaps";

           //aqui se llama al callback initMap
        window['initMap']=()=>{
          //se pone true porque ya se import la libreria googleapi
          this.mapsLoaded=true;
          //solo se usa cuando se halla importado la libreria de google
          //si no se importa no se puede usar esta variable "google",
          // asi se valida que la libreria ah sido cargada
          if(google){
              console.log('google is loaded');
          }else{
              console.log('gogole is not defined');
          }
          resolve(true);
          return;

        }

        if(this.apikey){
          //apenas termine de cargar la libreria de api de google se llamara alcallback inirMap
          script.src="https://maps.googleapis.com/maps/api/js?key="+this.apikey+"&callback=initMap";    
        }else{
          script.src="https://maps.googleapis.com/maps/api/js?key=callback=initMap";
        }
       
        renderer.appendChild(document.body,script);
    })
    

  }




}
