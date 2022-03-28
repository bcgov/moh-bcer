/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"

describe("Tests when no manufacturing report has been submitted", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  })

  it("Tests that correct number of missing manufacturing is shown in dashboard", () => {
    cy.contains("1 locations with outstanding Manufacturing Reports");
  })

  it("Tests Manufacturing page without any manufacturing report", () => {
    Navigate.gotoManufacturing();
    cy.contains("Submitted Manufacturing Reports");
    cy.contains("No records to display")
  })
})