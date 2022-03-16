import { businessFieldNames, businessInfo } from "./business/businessObjects";
import { exampleManualLocations, locationFieldNames } from "./location/locationObjects";
import { insideDialog } from "./util";

/**
 * Contains method to fill different forms in the application
 */
 export class FillForm {
  /**
   * Fills the business info form 
   */
  static fillBusinessForm() {
    cy.get(businessFieldNames.legalName).type(businessInfo.legalName);
    cy.get(businessFieldNames.businessName).type(businessInfo.businessName);
    cy.get(businessFieldNames.addressLine1).type(businessInfo.addressLine1);
    cy.get(businessFieldNames.addressLine2).type(businessInfo.addressLine2);
    cy.get(businessFieldNames.city).type(businessInfo.city);
    cy.get(businessFieldNames.postal).type(businessInfo.postal);
    cy.get(businessFieldNames.phone).type(businessInfo.phone);
    cy.get(businessFieldNames.email).type(businessInfo.email);
    cy.get(businessFieldNames.webPage).type(businessInfo.webPage);
  }

  /**
   * Fills the location info popup form
   * @param location `BusinessLocation` business location info
   */
  static fillManualLocationForm(location) {
    cy.get(locationFieldNames.addressLine1).type(location.addressLine1, {
      delay: 100,
    });
    cy.wait(1000);
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    cy.get(".MuiDialog-paper").within(() => {
      cy.get(locationFieldNames.email).type(location.email);
      cy.get(locationFieldNames.phone).type(location.phone);
      cy.get(locationFieldNames.postal).type(location.postal);
      cy.get(locationFieldNames.underage[location.underage]).click();
      if (location.underage === "other") {
        cy.get(locationFieldNames.underageOther).type(location.underageOther);
      }
      cy.get(
        locationFieldNames.healthAuthority[location.healthAuthority]
      ).click();
      if (location.healthAuthority === "other") {
        cy.get(locationFieldNames.healthAuthorityOther).type(
          location.healthAuthorityOther
        );
      }
      cy.get(locationFieldNames.manufacturing[location.manufacturing]).click();
    });
  }

  static correctlyFillWrongLocation(){
    cy.get(locationFieldNames.addressLine1).type("1200 Bla", {
      delay: 100,
    });
    cy.wait(1000);
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    cy.get(".MuiDialog-paper").within(() => {
      cy.get(locationFieldNames.phone).type("1111111111").blur();
      cy.wait(1000)
      cy.get(locationFieldNames.postal).type("k0k0k0").blur();
      cy.wait(1000)
      cy.get(
        locationFieldNames.healthAuthority.fraser
      ).click().blur()
    });
  }
}

export class CheckForm {
  static checkBusinessForm(business){
    cy.get(businessFieldNames.legalName).should("have.value",  business.legalName);
    cy.get(businessFieldNames.businessName).should("have.value", business.businessName);
    cy.get(businessFieldNames.addressLine1).should("have.value", business.addressLine1);
    cy.get(businessFieldNames.addressLine2).should("have.value", business.addressLine2);
    cy.get(businessFieldNames.city).should("have.value", business.city);
    cy.get(businessFieldNames.postal).should("have.value", business.postal);
    cy.get(businessFieldNames.email).should("have.value", business.email);
    cy.get(businessFieldNames.phone).should("have.value", business.phone);
    cy.get(businessFieldNames.webPage).should("have.value", business.webPage);
  }

  static checkLocationForm(location){
    insideDialog(() => {
      cy.get(locationFieldNames.addressLine1).invoke("attr", "value").then( val => {
        expect(val).to.have.lengthOf.above(2);
      })
      cy.get(locationFieldNames.phone).should("have.value", location.phone);
      cy.get(locationFieldNames.email).should("have.value", location.email);
      cy.get(locationFieldNames.city).invoke("attr", "value").then(val => {
        expect(val).to.have.lengthOf.above(1);
      })
      // cy.get(locationFieldNames.doingBusinessAs).invoke("attr", "value").then(val => {
      //   expect(val).to.be.oneOf([location.doingBusinessAs || businessInfo.businessName]);
      // })
      cy.get(locationFieldNames.underage[location.underage]).should("be.checked");
      if(location.underage === "other"){
        cy.get(locationFieldNames.underageOther).should("have.value", location.underageOther)
      }
      cy.get(locationFieldNames.healthAuthority[location.healthAuthority]).should("be.checked");
      if(location.healthAuthority === 'other'){
        cy.get(locationFieldNames.healthAuthorityOther).should("have.value", location.healthAuthorityOther);
      }
      cy.get(locationFieldNames.manufacturing[location.manufacturing]).should("be.checked");
    })
  }
}