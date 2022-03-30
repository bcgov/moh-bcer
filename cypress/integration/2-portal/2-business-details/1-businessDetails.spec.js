/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"

describe("Tests the Business Details in business details page", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.contains("Test business name").parent().click();
    cy.wait(1000);
  })

  it("Business details is properly populated", () => {
    cy.contains("Test business legal name");
    cy.contains("Test business name");
    cy.contains("Test address line 1");
    cy.contains("test@test.com");
    cy.contains("Test city");
    cy.contains("a0a0a0");
  })

  it("Business reporting status is properly identified", () => {
    cy.contains("No Outstanding Reports")
  })

  it("Tests that link to location details page works correctly", () => {
    cy.contains("1100 Blanshard St, Victoria, BC").click();
    cy.contains("Location Information");
    cy.contains("Business Details").click();
    cy.contains("No Outstanding Reports")
  })
})