import { api, LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats";

const BOAT_OBJECT = "Boat__c";

export default class SimilarBoats extends NavigationMixin(LightningElement) {
  // Private
  currentBoat;
  relatedBoats;
  boatId;
  error;

  // the recordId set/get is necessary if you want to use the component on the record page
  // in that way SF is passing the recordId
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute("boatId", value);
    //sets boatId assignment
    this.boatId = value;
  }

  @api
  similarBy;

  // Wire custom Apex call, using the import named getSimilarBoats
  // Populates the relatedBoats list
  // the function is not called imperatively but is wired, which means the framework is controlling the call, cash etc.
  @wire(getSimilarBoats, { boatId: "$boatId", similarBy: "$similarBy" })
  similarBoats({ error, data }) {
    if (data) {
      this.relatedBoats = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
    }
  }

  // getters are useful when you need to add a small calculation to your template 
  get getTitle() {
    return "Similar boats by " + this.similarBy;
  }

  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }

  // Navigate to record page
  // the handler for boatselect event, which is register at this component (onboatselect)
  // but triggered on boattile component
  openBoatDetailPage(event) {
    /* 
      this class is extending NavigationMixin class which means
      that we have access to NavigationMixin.Navigate function and we can it with  this[NavigationMixin.Navigate]
    */
    this[NavigationMixin.Navigate]({ 
      // syntax means that object NavigationMixin with property Navigate has a value which is a property on 'this' object
      // object[...] its a way of accessing object properties dynamically 
      type: "standard__recordPage",
      attributes: {
        recordId: event.detail.boatId,
        objectApiName: BOAT_OBJECT,
        actionName: "view"
      }
    });
  }
}
