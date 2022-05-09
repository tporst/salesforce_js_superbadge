// imports
import { LightningElement, api, track} from "lwc";
import { getLocationService } from 'lightning/mobileCapabilities';
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  boatTypeId;
  mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  myLocationService;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  wiredBoatsJSON({error, data}) { }
  

  connectedCallback() {
    this.myLocationService = getLocationService();
 /*    if (this.myLocationService == null || !this.myLocationService.isAvailable()) {
        this.locationButtonDisabled = true;
    } */
}



  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { 
      
    console.log('is rendered '+this.isRendered)
    console.log('isAvailable' +this.myLocationService.isAvailable());
    if (!this.isRendered)
   {
       this.isRendered= !this.isRendered;
       this.getLocationFromBrowser();
   }




}
  
    // Gets the location from the Browser
    // position => {latitude and longitude}
    getLocationFromBrowser() {
     


        const locationOptions = { enableHighAccuracy: true };
        this.myLocationService
               .getCurrentPosition(locationOptions)
               .then((result)  => {
                   this.currentLocation = result;
 
                   // result is a Location object
                   console.log(JSON.stringify(result));
 
               }).catch((error) => {console.log('error');  console.log(JSON.stringify(error));})


  
    
    
    
    }
  
  // Creates the map markers
  createMapMarkers(boatData) {
     // const newMarkers = boatData.map(boat => {...});
     // newMarkers.unshift({...});
   }
}