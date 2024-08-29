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

  it("Tests that Business Locations filter was render correctly", () => {
    cy.contains("Show more filter").click();
    cy.contains("Search (Address, Business Name, Legal Name, Doing Business As)");
    cy.contains("Health Authority");
    cy.contains("Location Type");
    cy.contains("Underage Allowed");
    cy.contains("NOI Status");
    cy.contains("Product Report Status");
    cy.contains("Manufacturing Report Status");
    cy.contains("Sales Report Status");
    cy.contains("Location Creation Start Date");
    cy.contains("Location Creation End Date");
    cy.contains("Search");
    cy.contains("4 retail locations.");
  })

  it("Tests that link to location details page works correctly", () => {
    cy.contains("Test business name").click();
    cy.contains("Location Information");
    cy.contains("Submitted Locations").click();
  })

  it("Tests that link to map works correctly", () => {
    cy.wait(2000)
    UserAction.clickFirstCheckBox();
    clickButton("Show on Map");
    cy.contains("Route");
    clickButton("Back");
  })
})