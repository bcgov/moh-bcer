/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";

describe("Tests the location details page", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.wait(1000);
    cy.contains("Submitted Locations").click();
    cy.wait(1000);
    cy.contains("Test business name").click();
  });

  it("Displays the user details correctly", () => {
    cy.wait(1000);
    cy.contains("Test User");
    cy.contains("sagar@freshworks.io");
  });

  it("Displays the locations details correctly", () => {
    cy.wait(1000);
    cy.contains("1100 Blanshard St, Victoria, BC");
    cy.contains("Victoria");
    cy.contains("2222222222");
    cy.contains("location2@test.com");
    cy.contains("Test underage");
    cy.contains("Not Renewed");
  });

  it("Displays number of number of reports submitted properly", () => {
    cy.contains("1 products submitted");
    cy.contains("0 manufacturing reports submitted");
    cy.contains("0 sales reports submitted");
  })
});
