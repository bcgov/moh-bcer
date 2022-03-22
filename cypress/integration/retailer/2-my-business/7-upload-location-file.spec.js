/// <reference types="cypress" />

import { FillForm } from "../../utils/fillForm";
import { locationErrorMessages } from "../../utils/location/locationObjects";
import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton, insideDialog } from "../../utils/util";

describe("It tests adding location with file upload", () => {
  // To avoid tests fails due to network exceptions
  // was occurring frequently during location geocoding.
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginRetailer();
    Navigate.gotoMyBusiness();
    cy.wait(1000)
    UserAction.addLocationFileUpload("businessLocations.csv");
  })

  it("Correctly shows/deletes location in error", () => {
    cy.contains("You have 2 retail locations.");
    cy.contains("There are 3 errors found.");
    UserAction.clickDeleteOnNewLocationConfirm(0);
    insideDialog(() => {
      UserAction.clickFirstCheckBox("confirmed");
      clickButton("Confirm");
    })
    cy.contains("You have 1 retail locations.");
  })

  it("Able to edit location in error and proceed", () => {
    UserAction.clickEditOnNewLocationConfirm(0);
    insideDialog(() => {
      cy.contains(locationErrorMessages.addressLine1.valid);
      cy.contains(locationErrorMessages.phone.required);
    })
    FillForm.correctlyFillWrongLocation();
    insideDialog(() => {
      cy.get("button").contains("Submit").parent().should("not.be.disabled").click();
    })
    cy.get(".MuiDialog-paper", {timeout: 20000}).should("not.exist")
    cy.get("button").contains("Next").parent().should("not.be.disabled")
    clickButton("Next")
    cy.contains("Confirm Business Details and Submit")
    cy.contains("You have 2 retail entries")
  })
})