/// <reference types="cypress" />

import { Navigate } from "../utils/navigate";


describe('Updates Locations and noi creation date', () => {

  before(() => {
    cy.exec('npm run update:date').its('code').should('eq', 0)
  })

  beforeEach(() => {
    Navigate.loginRetailer();
    cy.wait(1000);
    Navigate.gotoRetailerDashBoard();
  })

  it("Shows both NOI and sales report is outstanding", () => {
    cy.contains("2 locations with outstanding Notice of Intent");
    cy.contains("2 locations with outstanding Sales Report");
  });
})