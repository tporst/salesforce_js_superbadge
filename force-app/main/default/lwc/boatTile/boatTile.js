import { LightningElement, api, track} from "lwc";
 const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
 const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
 export default class BoatTile extends LightningElement {
     @api boat;
     selectedBoatId;
         
     get backgroundStyle() {
         return `background-image:url(${this.boat.Picture__c})`;
     }
     get tileClass() {
        return this.selectedBoatId == this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
 
     }
     selectBoat() {      
         console.log('select boat');
         this.selectedBoatId = this.selectedBoatId == this.boat.Id ? false :  this.boat.Id;
         let boatselect = new CustomEvent('boatselect', {detail:    {boatId: this.boat.Id},bubbles: true,cancelable: true });
         this.dispatchEvent(boatselect);
         
     }
 }