import { AppMapServices } from '../services/app.map.services';
import { AppService } from '../services/app.services';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { Plugins, AppState } from '@capacitor/core';
import { DOCUMENT } from '@angular/common';
import { appStorageServices } from '../services/app.storage.services';
//usando el plugin geolocation
const {Geolocation}= Plugins;

const { App } = Plugins;

declare var google: any;

@Component({
  selector: 'app-oximap',
  templateUrl: './oximap.page.html',
  styleUrls: ['./oximap.page.scss'],
})
export class OximapPage implements OnInit {
  listarPersonas = [];
  // Esto es para ver el origen y el destino
  directionsService: any;
  // Esto es para ver pintar la ruta  
  directionsDisplay: any;
  findMap: any;
  marker: any;
  newMarker: any;
  markerDestination: any;
  infowindow: any;
  myFirebasePosition: any;
  myActualPosition:any
  positionDestination: any;
  idStorage: any;
  verificarId: boolean = false;


  @ViewChild('findMap') divMap: ElementRef;
  constructor(private _serviceOxiMap: AppService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private appMapServices: AppMapServices,
    private _storageServices: appStorageServices
  ) { 
   
  }

  ngOnInit() {
    this._storageServices.getStorage('idFire').then((res) => {
      if (res !== undefined) {
         //despies de llamar al idStrorage
       //para pintar el mapa

        this.idStorage = res;
        this.init()
        this.getListFindPerson(this.idStorage);
      }
    }).catch(err => { console.log('error al cargar idStorage de ServicesStorage') })


  
  }

  getActualPosition(){
     
      Geolocation.getCurrentPosition().then(res=>{
        this.myActualPosition={
          lat:res.coords.latitude,
          lng:res.coords.longitude
          }
          if(this.myFirebasePosition?.lat){
            const distance= this._serviceOxiMap.calculateDistance(this.myActualPosition,this.myFirebasePosition)
            // console.log(distance);
              if(distance>=70){
                  this._serviceOxiMap.updateInfoOneFirebase(this.idStorage,this.myActualPosition);
              }
          }
        })

      
  }

  async init() {
      //lamando nuestra posicion cada 10 segundos
      setInterval(()=>{this.getActualPosition()},4000);

    this.appMapServices.init(this.renderer, this.document)
      .then(() => {
        //Estos metodos se ejecuta cuando se halla cargado el script de google api
        //antes de pintar el mapa ,este primero porque necesitamos el id de la persona en storage      
        this.getPerson();
      })
  }



  getPerson() {

    if (this.idStorage) {
      this.verificarId = true;
      this._serviceOxiMap.getInfoOneFirebase(this.idStorage).subscribe((e: any) => {
         console.log('Una sola llamada');

        this.myFirebasePosition = {
          lat: e.data().lat,
          lng: e.data().lng
        }
        this.initMap();
      })

    }

  }
  getListFindPerson(idStorage: string) {

    this._serviceOxiMap.getInfoFirebase().subscribe(doc => {
      //verificamos si la lista esta llena para remover markers
      console.log('primero')

      //Si recien inicia hace su push
      if (this.listarPersonas.length < 1) {
        doc.map((e: any) => {
          
          if (e.payload.doc.data().id == idStorage) {
            console.log(e.payload.doc.data())
            this.myFirebasePosition = {
              lat: e.payload.doc.data().lat,
              lng: e.payload.doc.data().lng
            }
          }else{
                 console.log(e.payload.doc.data().id !== idStorage);
            this.listarPersonas.push({ ...e.payload.doc.data(), marker: this.newMarker })
          }
            
        });
        this.ListMarkers();
      } else {
        //si ya esta iniciado
        doc.map((e: any) => {

          this.listarPersonas.filter(ele => {
            if (e.payload.doc.data().id == idStorage) {
              if (this.myFirebasePosition.lat!== e.payload.doc.data().lat || this.myFirebasePosition.lng!== e.payload.doc.data().lng) {
                this.myFirebasePosition= {
                lat: e.payload.doc.data().lat,
                lng: e.payload.doc.data().lng
               }
                if(this.marker &&this.marker.setMap){
                    this.marker.setMap(null);
                    this.marker = new google.maps.Marker({
                      map: this.findMap,
                      position: this.myFirebasePosition,
                      //puedo mover el marcador de un lugar a otro
                      draggable: false
                    })
                  }
                }
              }
            if ((ele.id == e.payload.doc.data().id) && (e.payload.doc.data().id !== idStorage)) {
             
              if (ele.lat!== e.payload.doc.data().lat || ele.lng!== e.payload.doc.data().lng) {
                ele.lat= e.payload.doc.data().lat;
                ele.lng= e.payload.doc.data().lng;
                this.clearMarkMap(ele);
                console.log('saliendo del borrado')
                 
                
              }
              
            }
            return ele;
          })
          console.log('antes')
          // if(contador>0 && (e.payload.doc.data().id !== idStorage) ){
          //   console.log('despues')
          //   this.listarPersonas.push(info);
          //   this.addMarker(info);
          // }
        
        });
           
         }
    });
    console.log(this.listarPersonas);
  

  }
  initMap() {
    //la posicion en el mapa
    let latLng = new google.maps.LatLng(this.myFirebasePosition.lat, this.myFirebasePosition.lng);
    let mapOptions = {
      //centrar el mapa en la posicion latLng
      center: latLng,
      zoom: 15,
      //deshabilita botones como el icono de persona, del mas del menos en el mapa y el satelite
      disabledUI: true,
      //cada vez que doy click se mueve elmarcador y me da la descripcion del lugar clikeado
      clickableIcon: false
    }
    //parama1: en donde se renderizara elmapa, las opciones del mapa
    this.findMap = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    //se crea el marcador
    this.addMyMarker();
    //centrar el mapa en esta posicion cada vez que elmarcador cambia de posicion
    this.findMap.panTo(this.myFirebasePosition);

    this.infowindow = new google.maps.InfoWindow();
    //Se añade el marcador al Mapa
    //this.addMyMarker(this.myFirebasePosition);
    //Listamos a los amigos cercanos
    this.ListMarkers();

    //asignando mapa al servicio de ruta
    this.directionsDisplay = new google.maps.DirectionsRenderer();

  }
  addMyMarker(){
    this.marker = new google.maps.Marker({
      map: this.findMap,
      position: this.myFirebasePosition,
      //son varias opciones de animacion
      animation: google.maps.Animation.DROP,
      //puedo mover el marcador de un lugar a otro
      draggable: false
    })
  }

  setMapOnAll<tipo>(map: tipo | null) {
    for (let i = 0; i < this.listarPersonas.length; i++) {
      this.listarPersonas[i].marker.setMap(map);
    }
    this.listarPersonas = [];
  }
  clearMarkMap(element:any) {
    element.marker.setMap(null);
    console.log('borro')
    this.addMarker(element);
  }
  ListMarkers() {
    let position = {
      lat: 0,
      lng: 0
    };

    this.listarPersonas.map(e => {
      position.lat = e.lat;
      position.lng = e.lng;
      //e.marker.setMap(null)
      this.addMarker(e);

    });



  }

  DrawRoute() {

    let latLng = new google.maps.LatLng(this.positionDestination.lat, this.positionDestination.lng);
    //Este codigo es para poner un marker al destino
    /*  this.markerDestination = new google.maps.Marker({
      map: this.findMap,
      animation: google.maps.Animation.DROP,
      draggable: true
    })
    this.markerDestination.setPosition(latLng);
**/


    this.directionsDisplay.setMap(this.findMap);
    //Iniciar con el renderizado de ruta
    this.directionsService = new google.maps.DirectionsService();
    this.directionsService.route({
      origin: this.myFirebasePosition,
      destination: this.positionDestination,
      // waypoints: this.wayPoints,
      //optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {

      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });


  }

 

  addMarker(info: any) {
    const image = {
      url: "https://img.icons8.com/color/452/google-logo.png",
      size: new google.maps.Size(71, 71),
      // el origen de la imagen es (0, 0).
      origin: new google.maps.Point(0, 0),
      //anclado desde la base del icono o imagen 
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(30, 30)
    }
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: "poly",
    };
    info.marker = new google.maps.Marker({
      position: { lat: info.lat, lng: info.lng },
      map: this.findMap,
      title: info.names,
      icon: image,
     // animation: google.maps.Animation.DROP,
      //Optimizar un markador,esto permite que el icono se agrande parpadeando
      //  optimized: true,
    });
    //si ledan click al marker
    info.marker.addListener("click", () => {
      this.positionDestination = { lat: info.lat, lng: info.lng };
      this.infowindow.close();
      this.infowindow.setContent(info.marker.getTitle());
      this.infowindow.open(info.marker.getMap(), info.marker);
    });

  }






  // async PAMS(){
  //   App.addListener('appStateChange', (state: AppState) => {
  //     // state.isActive contains the active state
  //     console.log('App state changed. Is active?', state.isActive);
  //   });
  //    this.ret = await App.canOpenUrl({ url: 'https://examenespams.xyz/' });
  //     console.log('Can open url: ', this.ret.value);

  //     this.ret = await App.openUrl({ url: 'https://examenespams.xyz/' });
  //     console.log('Open url response: ', this.ret);

  //     this.ret = await App.getLaunchUrl();
  //     if(this.ret && this.ret.url) {
  //       console.log('App opened with URL: ' + this.ret.url);
  //     }
  //     console.log('Launch url: ', this.ret);

  //     App.addListener('appUrlOpen', (data: any) => {
  //       console.log('App opened with URL: ' +  data.url);
  //     });

  //     App.addListener('appRestoredResult', (data: any) => {
  //       console.log('Restored state:', data);
  //     });
  // }
}
