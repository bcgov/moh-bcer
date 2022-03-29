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
    cy.contains("Test1 User1");
    cy.contains("sagarbhp@gmail.com");
  });

  it("Displays number of number of reports submitted properly", () => {
    cy.contains("1 products submitted");
    cy.contains("1 manufacturing reports submitted");
    cy.contains("0 sales reports submitted");
  })
});
