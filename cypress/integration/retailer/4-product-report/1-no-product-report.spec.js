/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"

describe("Tests when no product report is submitted yet", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  })

  it("Tests that correct number of outstanding product report is shown in dashboard", () => {
    cy.contains("2 locations with outstanding Product Reports");
  })

  it("Tests that all product report table are populated with correct values", () => {
    Navigate.gotoProducts();
    cy.contains("You have submitted 0 product reports");
  })
})