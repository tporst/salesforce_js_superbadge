import { LightningElement, wire, track, api } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import boatMessageChannel from '@salesforce/messageChannel/BoatMessageChannel__c';


const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';


import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import CONTACT_FIELD from '@salesforce/schema/Boat__c.Contact__r.Name';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';


export default class BoatSearchResults extends LightningElement {
 
  columns = [{ label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text', editable : 'true' },
  { label: 'Length', fieldName: LENGTH_FIELD.fieldApiName, type: 'currency', editable : 'true' },
  { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'number' , editable : 'true'},
  { label: 'Description', fieldName: DESCRIPTION_FIELD.fieldApiName, type: 'text' , editable : 'true'}];
  @track
  selectedBoatId='';
  @track
  boatTypeId = '';
  @track
  boats;
  @track draftValues = [];
  isLoading = false;



  constructor() {
    super();
    this.updateSelectedTile = this.updateSelectedTile.bind(this);
    this.template.addEventListener('boatselect',this.updateSelectedTile);
  }


  // wired message context
  @wire(MessageContext)
  messageContext;

  // wired getBoats method 
  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats({ error, data }) {
    if (data) {
        console.log('wiredBoats get boats')
        this.boats = data;
    } else if (error) {
       // console.log('something went wrong '+ error);
    }
    this.isLoading=false;
    this.notifyLoading(false);
}
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) { 
    console.log('searchBoats '+boatTypeId);
    this.isLoading=true;
    this.notifyLoading(true);
    this.boatTypeId=boatTypeId}
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() { 
      console.log('refresh is called')    
      await refreshApex(this.boats);
      console.log('refresh is over')
    }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    if(event?.detail){
      this.selectedBoatId = event.detail.boatId;      
      this.sendMessageService(event.detail.boatId);
    }  
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    const payload = { recordId: boatId };
    publish(this.messageContext, boatMessageChannel, payload);
    // explicitly pass boatId to the parameter recordId
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    console.log(JSON.stringify(updatedFields))
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((result) => {
        console.log('normaly than'+result);
        this.dispatchEvent(
                            new ShowToastEvent({
                                title: SUCCESS_TITLE,
                                message: MESSAGE_SHIP_IT,
                                variant: SUCCESS_VARIANT
                            })
                       );
        this.refresh();
        console.log('normaly than after refresh');
    })
    .catch(error => {
        this.dispatchEvent(
                           new ShowToastEvent({
                                 title: ERROR_TITLE,
                                 variant: ERROR_VARIANT
                             })
             );
        if(error) console.log('updateBoatList error'+JSON.stringify(error));
        this.notifyLoading(false);
    })
    .finally(() => {
        this.draftValues = [];

        console.log('finally ');
        this.notifyLoading(false);
    });

    
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    this.isLoading = isLoading;
    if(isLoading){ this.dispatchEvent(new CustomEvent('loading', {bubbles: true,cancelable: true }))}
    else{
        this.dispatchEvent(new CustomEvent('doneloading', {bubbles: true,cancelable: true }))
    }

   }
}