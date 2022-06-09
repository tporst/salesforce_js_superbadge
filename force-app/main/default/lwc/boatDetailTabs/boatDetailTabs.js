import { LightningElement , track, wire } from 'lwc';
// Custom Labels Imports
import { APPLICATION_SCOPE,subscribe,MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { getRecord , getFieldValue} from 'lightning/uiRecordApi';
// import labelDetails for Details
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
// Boat__c Schema Imports
import BOAT_OBJECT from '@salesforce/schema/boat__c'
import BOAT_ID_FIELD from '@salesforce/schema/boat__c.Id'
import BOAT_NAME_FIELD from '@salesforce/schema/boat__c.Name'
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD,PRICE_FIELD,LENGTH_FIELD,DESCRIPTION_FIELD];
export default class BoatDetailTabs extends LightningElement {
 
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };
  
  @track
  boatId;

  @track
  activeTab;
  
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredRecord;
  
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() { return 'utility:anchor'}
  
  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() { return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);}
  get id() { return getFieldValue(this.wiredRecord.data, BOAT_ID_FIELD);}

  get boatPriceField(){return PRICE_FIELD; }
  get boatLengthField (){return LENGTH_FIELD; }
  get boatDescriptionField (){return DESCRIPTION_FIELD; }
  get boatObj() {return BOAT_OBJECT}
 
  
  // Private
  subscription = null;
  
  @wire(MessageContext)
  messageContext;
  // Subscribe to the message channel
  subscribeMC(){
    if(!this.subscription){
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => {this.boatId = message.recordId},
            { scope: APPLICATION_SCOPE }
        );
    }
}
  
  // Calls subscribeMC()
  // Runs when component is connected, subscribes to BoatMC
  connectedCallback() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.boatId) {
        return;
    }
    this.subscribeMC();
    // Subscribe to the message channel to retrieve the recordID and assign it to boatId.
}
  
  // Navigates to record page
  navigateToRecordViewPage() { }
  
  // Navigates back to the review list, and refreshes reviews component
  handleReviewCreated() {
    this.activeTab ='reviews';
    this.template.querySelector('c-boat-reviews').refresh();
  }
}
