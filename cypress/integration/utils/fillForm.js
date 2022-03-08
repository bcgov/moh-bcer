import { businessFieldNames, businessInfo } from "./business/businessObjects";
import { locationFieldNames } from "./location/locationObjects";

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
}