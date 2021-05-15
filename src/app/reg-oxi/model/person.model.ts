export class PersonModel{
    id?:string;
    names:string;
    avatar:string; 
    lng:number;
    lat:number;
    
    constructor( names:string, avatar:string, lng:number,lat:number){
        this.names=names;
        this.avatar=avatar;
        this.lng=lng;
        this.lat=lat;
    }
}