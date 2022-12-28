import { createElement } from 'lwc';
import boatsNearMe from 'c/boatsNearMe';
  
describe('c-unit-test', () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
    
  it('displays unit status with default unitNumber', () => {
    const element = createElement('c-boats-near-me', {
      is: boatsNearMe
    });
     expect(element.boatTypeId).toBe(undefined);
    // Add the element to the jsdom instance
    document.body.appendChild(element);
    //expect(element.boatTypeId).toBe(undefined);
    // Verify displayed greeting
    //const div = element.shadowRoot.querySelector('div');

    //expect(div.textContent).toBe('Unit 5 alive!'); 
  });
});
