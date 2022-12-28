import { LightningElement, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// schema imports
import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import NAME_FIELD from "@salesforce/schema/BoatReview__c.Name";
import COMMENT_FIELD from "@salesforce/schema/BoatReview__c.Comment__c";
import BOAT_REF_FIELD from "@salesforce/schema/BoatReview__c.Boat__c";
// constants
const SUCCESS_TITLE = "Review Created!";
const SUCCESS_VARIANT = "success";

export default class BoatAddReviewForm extends LightningElement {
  // Private
  @track
  boatId;
  rating;
  @track
  value;
  boatReviewObject = BOAT_REVIEW_OBJECT;
  nameField = NAME_FIELD;
  commentField = COMMENT_FIELD;
  boatReferenceField = BOAT_REF_FIELD;
  labelSubject = "Review Subject";
  labelRating = "Rating";
  labelSubmit = "Submit";

  // Public Getter and Setter to allow for logic to run on recordId change
  // its possible to make getter setter as component property by decorating it with @api
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    console.log("BoatAddReviewForm id: " + value);
    this.boatId = value;
    //sets boatId attribute
    //sets boatId assignment
  }

  // Gets user rating input from stars component
  handleRatingChanged(event) {
    this.rating = event.detail.rating;
    console.log("handleRatingChanged " + JSON.stringify(event.detail.rating));
  }

  // Custom submission handler to properly set Rating
  // This function must prevent the anchor element from navigating to a URL.
  // form to be submitted: lightning-record-edit-form
  handleSubmit(event) {
    //console.log('Submit '+JSON.stringify(event.detail));
    event.preventDefault();
    const fields = event.detail.fields;
    fields.Boat__c = this.boatId;
    fields.Rating__c = this.rating;
    this.template.querySelector("lightning-record-edit-form").submit(fields); //you can overwrite the submit and change the values for each field
  }

  // Shows a toast message once form is submitted successfully
  // Dispatches event when a review is created
  handleSuccess() {
    // TODO: dispatch the custom event and show the success message
    this.dispatchEvent(
      new ShowToastEvent({
        title: SUCCESS_TITLE,
        variant: SUCCESS_VARIANT
      })
    );
    let submit = new CustomEvent("createreview", {
      detail: {},
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(submit);
    this.handleReset();
  }

  // Clears form data upon submission
  // TODO: it must reset each lightning-input-field
  handleReset() {
    const inputFields = this.template.querySelectorAll("lightning-input-field");
    console.log("****** " + JSON.stringify(inputFields));

    if (inputFields) {
      inputFields.forEach((field) => {
        field.reset();
      });
    }
  }
}
