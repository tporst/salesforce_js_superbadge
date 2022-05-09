// imports
import { LightningElement, api, track, wire} from "lwc";
import { getLocationService } from 'lightning/mobileCapabilities';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @track
  boatTypeId='';
  @track
  mapMarkers = [];
  @track
  isLoading = true;
  isRendered;
  @track
  latitude;
  @track
  longitude;
  myLocationService;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire (getBoatsByLocation, {latitude: '$latitude', longitude:'$longitude', boatTypeId:'$boatTypeId'})
  wiredBoatsJSON({error, data}) {

    if(data){
      this.createMapMarkers(data);
  
    }else if(error){
      this.dispatchEvent(
        new ShowToastEvent({
            title: ERROR_TITLE,
            message: error,
            variant: ERROR_VARIANT
        })
      );
    }
    this.isLoading=false;
  }
  
  // public function that updates the existing boatTypeId property
  @api
  searchBoats(boatTypeId) { 
    this.isLoading=true;
    this.boatTypeId=boatTypeId;
    console.log('boats near me boat type id '+this.boatTypeId);
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { 
    
    if (!this.isRendered){
        this.isRendered= !this.isRendered;
        this.getLocation();       
    }
  }

  async getLocation(){

    this.myLocationService = await getLocationService();
    //LocationService requires access to device hardware and device platform APIs. 
    //This access is only available when LocationService runs within a compatible Salesforce mobile app. It does not and cannot function when running in a standard web browser, whether the browser runs on a desktop or mobile device.
    if(this.myLocationService != null && this.myLocationService.isAvailable()){
      this.getLocationFromBrowser();
    }else{
      // dummy values in case the location service not available
      this.longitude = '73.358517';
      this.latitude = '14.322607';
    }
  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  async getLocationFromBrowser() {

    try{
      let result = await  this.myLocationService.getCurrentPosition({ enableHighAccuracy: true })
      this.latitude = result.coords.latitude;
      this.longitude = result.coords.longitude
    }catch(e){
      //dispatch toast error
      console.log('error '+e);
    }
  }
  
  // Creates the map markers
  createMapMarkers(boatData) {
    // const newMarkers = boatData.map(boat => {...});
    // newMarkers.unshift({...});
    boatData = JSON.parse(boatData);
    const newMarkers = boatData.map(boat => {
    let geoItem=
      { title: boat.Name,
        location: {
            Latitude: String(boat.Geolocation__Latitude__s),
            Longitude: String(boat.Geolocation__Longitude__s),

        }
      } ; 
    return geoItem;
    });
 
    newMarkers.unshift({
      icon: ICON_STANDARD_USER, 
      title: LABEL_YOU_ARE_HERE,
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude,
    }})
    this.mapMarkers = newMarkers;
  }
}