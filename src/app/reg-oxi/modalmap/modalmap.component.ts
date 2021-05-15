import { AppMapServices } from './../../services/app.map.services';
import { ModalController } from '@ionic/angular';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
//importanto plugin para geolocalizacion
import{Plugins} from'@capacitor/core'
//usando el plugin geolocation
const {Geolocation}= Plugins;

declare var google:any;

@Component({
  selector: 'app-modalmap',
  templateUrl: './modalmap.component.html',
  styleUrls: ['./modalmap.component.scss'],
})
export class ModalmapComponent implements OnInit {


  //coordenadas cuenca
  @Input() position={
    lat:-2.898116,
    lng:-78.9995814999999
  };

  label={
    titulo:'Ubicacion',
    subtitulo:'Mi ubicacion de envio'
  }
  // Esto es para ver el origen y el destino
  directionsService:any;
  // Esto es para ver pintar la ruta  
  directionsDisplay:any;
  map:any;
  marker:any;
  markerDestination:any;
  infowindow:any;
  myPosition:any;
  positionDestination:any;
  //aqui se hace referencia al elementeo con un identificador #map
  @ViewChild('map') divMap:ElementRef;

  constructor(private renderer:Renderer2,
              @Inject(DOCUMENT) private document,
              private modalmapService:AppMapServices,
              private modalController:ModalController) { }

  ngOnInit():void {

    this.init();
  }

  getActualPosition(){}

  async init(){
    this.modalmapService.init(this.renderer,this.document).then(()=>{
      //Este metodo se ejecuta cuando se halla cargado el script de google api
      this.initMap();
    })
    .catch(err=>{console.log(err)})
    
  }

  initMap(){
    const position=this.position;
    let latLng= new google.maps.LatLng(position.lat,position.lng);

    let mapOptions={
      //centrar el mapa en la posicion latLng
      center:latLng,
      zoom:15,
      //deshabilita botones como el icono de persona, del mas del menos en el mapa y el satelite
      disabledUI:true,
      //cada vez que doy click se mueve elmarcador y me da la descripcion del lugar clikeado
      clickableIcon:false
    }
    //parama1: en donde se renderizara elmapa, las opciones del mapa
    this.map= new google.maps.Map(this.divMap.nativeElement,mapOptions);
    //marcador
    this.marker=new google.maps.Marker({
      map:this.map,
      //son varias opciones de animacion
      animation:google.maps.Animation.DROP,
      //puedo mover el marcador de un lugar a otro
      draggable:true
    })
    //este metodo ayuda a ubicar el addmarker
    this.addMarker(position);
    this.clickHandleEvent();
   //alhace click sale el infowindow
    // this.clickMarker();
  //mostrar lainfo del marcador
   this.infowindow = new google.maps.InfoWindow();
    this.setInfoWindow(this.marker,this.label.titulo,this.label.subtitulo);
  }

  async mylocation(){
        Geolocation.getCurrentPosition().then(res=>{     
          const position={
           lat:res.coords.latitude,
           lng:res.coords.longitude
         }
         this.addMarker(position);
        }).catch(err=>{console.log(err)})
    }

  clickMarker(){
      this.marker.addListener('click',(event:any)=>{
        this.setInfoWindow(this.marker,this.label.titulo,'Seleccion Manual');
      })
      this.markerDestination.addListener('click',(event:any)=>{
        this.setInfoWindow(this.markerDestination,this.label.titulo,'Destino');
      })
  }
  addMarker(position:any):void{
    let latLng= new google.maps.LatLng(position.lat,position.lng);
    this.marker.setPosition(latLng);
    //centrar el mapa en esta posicion cada vez que elmarcador cambia de posicion
     this.map.panTo(position);
     //si el usuario da click en un lugar y quiera guardar , entonces esa posicion se guarda 
     this.myPosition=position;
  }
//se movera el mismo marcador porque usamos la misma variable marker
  clickHandleEvent(){
    this.map.addListener('click',(event:any)=>{
          const position={
            lat:event.latLng.lat(),
            lng:event.latLng.lng()
          }
          this.addMarker(position);
          
          // this.markerDestination=new google.maps.Marker({
          //   map:this.map,
          //   animation:google.maps.Animation.DROP,
          //   draggable:true
          // })
          // let latLng= new google.maps.LatLng(position.lat,position.lng);
          // this.markerDestination.setPosition(latLng);
          // //centrar en esa posicion para pintar
          //    this.map.panTo(position);
          //  this.positionDestination=position;
          //  //asignando mapa al servicio de ruta
          //  this.directionsDisplay = new google.maps.DirectionsRenderer();
          //  this.directionsDisplay.setMap(this.map);
          //  //obtener los indicadores para centrar la vista del mapa en los dos indicadores
          //  const indicatorsEle: HTMLElement = document.getElementById('indicators');
          //  this.directionsDisplay.setPanel(indicatorsEle);
          //  //Pintar los puntos
          //  this.renderWayPoint(this.myPosition,this.positionDestination);       
    })
  }

  renderWayPoint(origin:object,destination:object){
    
    this.directionsService = new google.maps.DirectionsService();
    this.directionsService.route({
      origin: origin,
      destination: destination,
     // waypoints: this.wayPoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
       if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
         alert('Could not display directions due to: ' + status);
       }
    });
  }

  setInfoWindow(marker:any,title:string,subtitulo:string){

        const contentString=`<div id="contentInsideMap">
                              <div> </div>
                              <p style="font-weight:bold; margin-bottom:5px;">${title}</p>
                              <div id="bodyContent">
                              <button type="buttton" onclick="hola();">Click </button>
                                <p class="normal m-0">
                                  ${subtitulo}
                                </p>
                              </div>
                            </div>`;
           this.infowindow = new google.maps.InfoWindow({content:contentString});
          this.infowindow.setContent(contentString);
          this.infowindow.open(this.map,marker);
  }


  Aceptar(){
    this.modalController.dismiss({
      'dismissed':true,
      pos:this.myPosition
      
    });
  }
}
