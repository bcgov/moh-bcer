/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";
import { UserAction } from "../../utils/userAction";

describe("Tests the user management functionality", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginRetailer('user2');
  })

  it("Displays 1st time login page", () => {
    cy.contains("As a first-time user of this application");
  })
})