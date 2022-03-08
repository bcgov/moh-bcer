/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";
import { clickButton } from "../../utils/util";

describe("Testing dashboard for first time login", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  });

  it("Asks the user to create a new business", () => {
    cy.contains("Welcome to E-Substances Reporting Application");
    cy.contains("As a first-time user of this application");
    clickButton("Start");
    cy.contains("Confirm Your Business Details");
  });

  it("All the app bar buttons are disabled", () => {
    cy.get('nav a').should('have.class', 'Mui-disabled')
  });
});
