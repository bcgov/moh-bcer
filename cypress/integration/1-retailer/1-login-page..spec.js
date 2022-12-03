/// <reference types="cypress" />

describe('Testing login page', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.visit('/retailer')
  })

  it("Displays the login page when logged out", () => {
    cy.contains("E-Substances Reporting Application");
    cy.contains("Continue with Basic BCeID");
    cy.contains("Continue with Business BCeID");
  });
})