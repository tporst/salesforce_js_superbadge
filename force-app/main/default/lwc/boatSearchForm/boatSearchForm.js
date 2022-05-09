import { LightningElement, wire } from 'lwc';

// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    // Private
    error = undefined;   
    searchOptions;
    
    // Wire a custom Apex method, which means the lightning framework take care of caching and of triggering the call on the right moment 
      @wire(getBoatTypes)
      boatTypes({ error, data }) { 
        if (data) {

          this.searchOptions = data.map((type) => {
             
              return { label:type.Name, value: type.Id };
          });
          this.searchOptions.unshift({ label: 'All Types', value: '' });

        } else if (error) {
          this.searchOptions = undefined;
          this.error = error;
        }

        return this.searchOptions;
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      this.selectedBoatTypeId=event.target.value;
      let searchEvent = new CustomEvent('search', { detail:   {boatTypeId: this.selectedBoatTypeId},  bubbles: true,
        cancelable: true });
      this.dispatchEvent(searchEvent);

      let boatselect = new CustomEvent('boatselect', {detail:    {boatId: 'test'},bubbles: true,cancelable: true });
      this.dispatchEvent(boatselect);
    }
  }