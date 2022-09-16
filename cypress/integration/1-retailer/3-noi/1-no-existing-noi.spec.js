/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"

describe("Tests NOI tables are properly render when there are no active NOIs", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  })

  it("Checks that dashboard has 2 noi that has not been submitted", () => {
    cy.contains("My Dashboard");
    cy.contains("Outstanding Reports");
    cy.contains("2 locations with outstanding Notice of Intent");
  })

  it("It checks that all 3 NOI tables are rendered with proper number of locations", () => {
    Navigate.gotoNoi();
    cy.contains("You have 2 retail locations that need a Notice of Intent");
    cy.contains("You have 0 locations that require a Sales Report before their NOI can be renewed.");
    cy.contains("You have 0 retail locations. You can download/print the Notice of Intent for your Active locations.").scrollIntoView();
  })
})