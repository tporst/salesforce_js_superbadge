import { LightningElement, track, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
    @api boatTypeId;
    @track mapMarkers = [];
    @track isLoading = true;
    @track isRendered = false;
    @track latitude;
    @track longitude;
    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {

        console.log('+++++++ wiredBoatsJSON'+JSON.stringify(data));
        if (data) {
            this.createMapMarkers(data);
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
            this.isLoading = false;
        }
    }
    renderedCallback() {
        if (this.isRendered == false) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }
    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('position '+JSON.stringify(position))
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            },
            (e) => {
                console.log('error '+JSON.stringify(e))
                this.latitude = '48.137154';
                this.longitude = '11.576124';

            }, {
            enableHighAccuracy: true
        }
        );
    }
    createMapMarkers(boatData) {
        boatData = JSON.parse(boatData);
        this.mapMarkers = boatData.map(rowBoat => {
            return {
                location: {
                    Latitude: rowBoat.Geolocation__Latitude__s,
                    Longitude: rowBoat.Geolocation__Longitude__s
                },
                title: rowBoat.Name,
            };
        });
        this.mapMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: LABEL_YOU_ARE_HERE,
            icon: ICON_STANDARD_USER
        });
        console.log('mapMarkers '+JSON.stringify(this.mapMarkers));
        this.isLoading = false;
    }
}