/// <reference types="cypress" />

import {
  locationErrorMessages,
  locationFieldNames,
} from "../../utils/location/locationObjects";
import { Navigate } from "../../utils/navigate";
import { stringGen } from "../../utils/util";

const dialog =".MuiDialog-paper";

describe("Testing Location input form", () => {
  before(() => {
    Navigate.openBusinessSubmissionOnFirstLogin();
    Navigate.openLocationManualInputForm();
    cy.wait(500);
  });

  it("Fails business line 1 field validation", () => {
    cy.get(locationFieldNames.addressLine1).type("1", { delay: 2000 }).blur();
    cy.contains(locationErrorMessages.addressLine1.required);
  });

  it("Fails location email field validation", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.email).focus().blur();
      cy.contains(locationErrorMessages.email.required);
      cy.get(locationFieldNames.email).type(stringGen(4)).blur();
      cy.contains(locationErrorMessages.email.valid);
    });
  });

  it("Fails location phone number field validation", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.phone).focus().blur();
      cy.contains(locationErrorMessages.phone.required);
      cy.get(locationFieldNames.phone).type(stringGen(10)).blur();
      cy.contains(locationErrorMessages.phone.valid);
    });
  });

  it("Checks that city is disabled", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.city).should("be.disabled");
    });
  });

  it("Fails location postal code field validation", () => {
    cy.get(".MuiDialog-paper").within(() => {
      cy.get(locationFieldNames.postal).focus().blur();
      cy.contains(locationErrorMessages.postal.required);
      cy.get(locationFieldNames.postal).type(stringGen(6)).blur();
      cy.contains(locationErrorMessages.postal.valid)
    })
  })

  it("Fails location doing business as field validation", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.doingBusinessAs).type(stringGen(101)).blur();
      cy.contains(locationErrorMessages.doingBusinessAs.length);
    })
  })

  it("Fails underage other field validation", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.underage.other).click();
      cy.get(locationFieldNames.underageOther).focus().blur();
      cy.contains(locationErrorMessages.underageOther.required);
    })
  })

  it("Fails health authority field validation", () => {
    cy.get(dialog).within(() => {
      cy.get(locationFieldNames.healthAuthority.other).click();
      cy.get(locationFieldNames.healthAuthorityOther).focus().blur();
      cy.contains(locationErrorMessages.healthAuthorityOther.required);
    })
  })

  it('Fails to submit form without providing the rest of the fields', () => {
    cy.get(dialog).within(() => {
      cy.get("button").contains("Submit").click();
      cy.contains(locationErrorMessages.manufacturing.required);
    })
  })
});
