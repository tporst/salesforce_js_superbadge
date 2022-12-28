//import fivestar static resource, call it fivestar
import { LightningElement, track, wire, api } from "lwc";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import fivestar from "@salesforce/resourceUrl/fivestar";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// add constants here
const EDITABLE_CLASS = "c-rating";
const READ_ONLY_CLASS = "readonly c-rating";
const ERROR_TITLE = "Error loading five-star";
const ERROR_VARIANT = "error";

export default class FiveStarRating extends LightningElement {
  //initialize public readOnly and value properties
  @api
  readOnly;
  @api
  value;

  editedValue;
  isRendered;

  CURRENT_RATING;
  //getter function that returns the correct class depending on if it is readonly
  get starClass() {
    return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  // Render callback to load the script once the component renders.
  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.loadScript();
    this.isRendered = true;
  }

  //Method to load the 3rd party script and initialize the rating.
  //call the initializeRating function after scripts are loaded
  //display a toast with error message if there is an error loading script
  //the script can by access from window object like window.rating
  //the rating script is stored in tmp dir
  loadScript() {
    Promise.all([
      loadStyle(this, fivestar + "/rating.css"),
      loadScript(this, fivestar + "/rating.js")
    ])
      .then(() => {
        this.initializeRating();
      })
      .catch(() => {
        // create a custom event
        const event = new ShowToastEvent({
          title: ERROR_TITLE,
          variant: ERROR_VARIANT
        });
        this.dispatchEvent(event);
      });
  }

  /* 
  The same functionality but by using async and await 

  async loadScript() {
    try{
      // wait till all promises are resolved
      await Promise.all([loadScript(this, fivestar + '/rating.js'), loadStyle(this, fivestar + '/rating.css')]);
      this.initializeRating();
    }catch(e){

      this.dispatchEvent(
        new ShowToastEvent({
              title: ERROR_TITLE,
              variant: ERROR_VARIANT
          }))
      
    }
  } */

  initializeRating() {
    let domEl = this.template.querySelector("ul");
    let maxRating = 5;
    let self = this; //i think it would also work with this.bind(callback)
    let callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };

    this.ratingObj = window.rating(
      // it looks like load script load the js script into window object
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }

  // Method to fire event called ratingchange with the following parameter:
  // {detail: { rating: CURRENT_RATING }}); when the user selects a rating
  ratingChanged(rating) {
    let ratingChange = new CustomEvent("ratingchange", {
      detail: { rating: rating },
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(ratingChange);
  }
}
