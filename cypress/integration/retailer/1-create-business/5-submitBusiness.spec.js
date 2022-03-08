/// <reference types="cypress" />

import { FillForm } from "../../utils/fillForm";
import { exampleManualLocations } from "../../utils/location/locationObjects";
import { Navigate } from "../../utils/navigate";
import { UserAction } from "../../utils/userAction";
import { clickButton } from "../../utils/util";

describe("Tests the 1st time business submission flow", () => {
  // To avoid tests fails due to network exceptions
  // was occurring frequently during location geocoding.
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  before(() => {
    Navigate.openBusinessSubmissionOnFirstLogin();
    cy.wait(1000);
  });

  it("Successfully creates a test business with a location", () => {
    FillForm.fillBusinessForm();
    Navigate.openLocationManualInputForm();
    FillForm.fillManualLocationForm(exampleManualLocations[0]);
    cy.wait(1000);
    clickButton("Submit")
    UserAction.submitBusinessInfo();
    cy.contains("Your Business Details have been submited.");
    cy.contains("Next steps");
    cy.contains("Submit Notice of Intent to sell E-substances");
  });
});
