/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton } from "../../utils/util";

describe("Tests the submitted locations page", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.wait(1000);
    cy.contains("Submitted Locations").click();
  })

  it("Tests that location page was render correctly", () => {
    cy.contains("2 retail locations have submitted a Notice of Intent");
  })

  it("Tests that link to location details page works correctly", () => {
    cy.contains("Test business name").click();
    cy.contains("Location Information");
    cy.contains("Submitted Locations").click();
    cy.contains("Locations with a Notice of Intent")
  })

  it("Tests that link to map works correctly", () => {
    cy.wait(2000)
    UserAction.clickFirstCheckBox();
    clickButton("Show on Map");
    cy.contains("Route");
    clickButton("Back");
    cy.contains("Locations with a Notice of Intent");
  })
})