/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton } from "../../utils/util";

describe("Correctly shows dashboard component assuming 1 business and 1 location", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });

  beforeEach(() => {
    Navigate.loginPortal()
    cy.wait(1000);
  })

  it("Shows the dashboard page in data portal", () => {
    cy.contains("Businesses Overview");
    cy.contains("1 Business(es) with complete reports.");
    cy.contains("0 Business(es) with missing reports.");
  })

  context("Business Search functionality", () => {
    it("Search with business name works correctly", () => {
      UserAction.businessSearch("businessName", "Test business")
    })

    it("Search with address works correctly", () => {
      UserAction.businessSearch("addressLine1", "Test address")
    })

    it("Search with legal name works correctly", () => {
      UserAction.businessSearch("legalName", "Test business legal name");
    })

    it("Search with city works correctly", () => {
      UserAction.businessSearch("city", "Test city");
    })

    it("Search with postal code works correctly", () => {
      UserAction.businessSearch("postal", "a0a0a0");
    })

    it("Search with Health Authority works correctly", () => {
      UserAction.businessSearch("all", "Test city", "island", "fraser")
    })
  })

  it("Tests business complete/not-complete filter", () => {
    UserAction.clickRadio("location", "completed");
    cy.contains("Test business name");
    UserAction.clickRadio("location", "notCompleted");
    cy.contains("No records to display")
  })

  it("Tests that link to business details page works correctly", () => {
    cy.contains("Test business name").parent().click();
    cy.contains("Business Information")
  })
})