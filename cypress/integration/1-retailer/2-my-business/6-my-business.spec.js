/// <reference types="cypress" />

import { businessFieldNames, businessInfo } from "../../utils/business/businessObjects";
import { CheckForm } from "../../utils/fillForm";
import { exampleManualLocations } from "../../utils/location/locationObjects";
import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";

describe("Tests my-business assuming the 1st business creation with 1 location", () =>  {
  before(() => {
    Navigate.loginRetailer();
    cy.wait(1000)
    Navigate.gotoMyBusiness();
  })

  it("checks that business was created with proper value", () => {
    CheckForm.checkBusinessForm(businessInfo);
  })

  it("checks the correct number of existing location", () => {
    cy.contains("You have 2 retail locations")
  })

  context("Tests the Existing business locations", () => {
    beforeEach(() => {
      cy.reload();
    })

    it("checks that example location-1 was created/rendered with proper values", () => {
      UserAction.clickEditExistingLocation(0);
      cy.contains("Edit Business Location")
      CheckForm.checkLocationForm(exampleManualLocations[0])
    })

    it("checks that example location-2 was created/rendered peoperly", () => {
      UserAction.clickEditExistingLocation(1);
      CheckForm.checkLocationForm(exampleManualLocations[1])
    })
  })
})