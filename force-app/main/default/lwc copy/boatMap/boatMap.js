// import BOATMC from the message channel
// Import message service features required for subscribing and the message channel
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import boatMessageChannel from "@salesforce/messageChannel/BoatMessageChannel__c";
import { LightningElement, wire, track, api } from "lwc";
import { getRecord, getFieldValue } from "lightning/uiRecordApi";

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
// Declare the const LATITUDE_FIELD for the boat's Latitude
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];

import LONGITUDE_FIELD from "@salesforce/schema/Boat__c.Geolocation__Longitude__s";
import LATITUDE_FIELD from "@salesforce/schema/Boat__c.Geolocation__Latitude__s";

const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute("boatId", value);
    this.boatId = value;
  }

  error = undefined;
  mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;

  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: "$boatId", fields: BOAT_FIELDS })
  wiredRecord({ error, data }) {
    console.log("wiredRecord ******" + this.boatId);
    // Error handling
    if (data) {
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  // Subscribes to the message channel
  subscribeMC() {
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
      return;
    }

    this.subscription = subscribe(
      this.messageContext,
      boatMessageChannel,
      (message) => {
        //this.boatId = this.recordId(message.recordId);

        this.boatId = message.recordId;
        console.log("hallo " + this.recordId);
      },
      { scope: APPLICATION_SCOPE }
    );

    // Subscribe to the message channel to retrieve the recordId and explicitly assign it to boatId.
  }

  // Calls subscribeMC()
  connectedCallback() {
    this.subscribeMC();
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    console.log("Longitude" + Longitude);
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}
