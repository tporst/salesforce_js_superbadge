import { LightningElement, track, wire, api  } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

import BOATREVIEW_COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'

export default class BoatReviews  extends NavigationMixin(LightningElement) {


// Private
@track
boatId;
error;
@track
boatReviews;
isLoading;


// check if review can be shown
get reviewsToShow(){ 
  
  return (!!this.boatReviews && this.boatReviews.length > 0);
}

// Getter and Setter to allow for logic to run on recordId change
get recordId() { return this.boatId; }
@api
set recordId(value) {
  this.boatId=value;
  //sets boatId attribute
  //sets boatId assignment
  //get reviews associated with boatId
  this.getReviews();
}

// Public method to force a refresh of the reviews invoking getReviews
@api
refresh() {this.getReviews(); }

// Imperative Apex call to get reviews for given boat
// returns immediately if boatId is empty or null
// sets isLoading to true during the process and false when it’s completed
// Gets all the boatReviews from the result, checking for errors.
getReviews() { 
  if(this.boatId == null  || this.boatId == '') {
          return;
  }
  this.isLoading = true;
  this.error = undefined;

  getAllReviews({boatId:this.recordId})
      .then(result=>{
          this.boatReviews = result;
          this.isLoading = false;
      }).catch(error=>{
         this.error = error.body.message;
        }).finally(() => {
          this.isLoading = false;
        });
}

// Helper method to use NavigationMixin to navigate to a given record on click
navigateToRecord(event) {  
 
  //the function is available because we are extending the NavigationMixin class
  this[NavigationMixin.Navigate](//returns a function which take object as param,
      {
        type: "standard__recordPage",
        attributes: {
              recordId: event.target.dataset.recordId, //its defined on html tag as argument: data-record-id
              actionName: "view"
        }
      }
  );
}

}