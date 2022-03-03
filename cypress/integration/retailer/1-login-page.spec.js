/// <reference types="cypress" />

describe("Login page", () => {
  before(() => {
    cy.kcLogout();
    cy.visit("http://localhost:3000/");
  });

  it("Displays the login page ", () => {
    cy.contains("E-Substances Reporting Application");
    cy.contains("Continue with Basic BCeID");
    cy.contains("Continue with Business BCeID");
  });
});
