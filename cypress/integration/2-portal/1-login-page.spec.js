/// <reference types="cypress" />

describe('Testing login page', () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  
  beforeEach(() => {
    cy.kcLogout();
    cy.visit('/portal')
  })

  it("Displays the login page when logged out", () => {
    cy.contains("BC E-Substances Regulation Data Portal");
    cy.contains("Continue with IDIR");
    cy.contains("Continue with HA ID");
  });
})