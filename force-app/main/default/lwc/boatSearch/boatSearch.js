import { LightningElement, wire, track, api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import ID_FIELD from '@salesforce/schema/Boat__c.Id';
import IMG_FIELD from '@salesforce/schema/Boat__c.Picture__c';

import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import OWNER_FIELD from '@salesforce/schema/Boat__c.Contact__r.Name';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOATTYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__r.Name';


const FIELD_LIST = [ID_FIELD,IMG_FIELD,NAME_FIELD,PRICE_FIELD,LENGTH_FIELD,BOATTYPE_FIELD,OWNER_FIELD];
 // imports
 export default class BoatSearch extends LightningElement {
    isLoading = false;
   
   // for testing only
    @track
    boat;
    @track
    boatId;

    @wire(getRecord, { recordId: 'a027Q000001trtgQAA', fields: FIELD_LIST })
    reco({ error, data }) {
        
      if (data) {  
          this.boat = data;
          this.boatId = getFieldValue(data, ID_FIELD);
          this.error = undefined;
      } else if (error) {
          this.error = error;
          this.record = undefined;
      }
  }
    

// ----------------------------
    constructor() {
        super();
        this.searchBoats = this.searchBoats.bind(this); //important to bind the callback function to this context, otherweise is not possible to access the this.template in callback function
        this.handleLoading = this.handleLoading(this);
        this.handleDoneLoading = this.handleDoneLoading(this);

        this.template.addEventListener('search',this.searchBoats);
        this.template.addEventListener('loading',this.handleLoading );
        this.template.addEventListener('doneloading',this.handleDoneLoading);
     
      }



    // Handles loading event
    handleLoading() { this.isLoading=true;}
    
    // Handles done loading event
    handleDoneLoading() {this.isLoading=false; }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {

      console.log('the main component recived event**: '+ event.detail.boatTypeId);
      //let searchResults = this.template.querySelector('div');
      //to access the template the searchBoats callback has to be bind to this contect, best in constructor
      this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId);
  
     }
    
    createNewBoat() { }
  }