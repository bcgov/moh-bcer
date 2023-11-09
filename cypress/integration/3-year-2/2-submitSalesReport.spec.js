/// <reference types="cypress" />

const { Navigate } = require("../utils/navigate");
const { UserAction } = require("../utils/userAction");
const { Selector, inside, clickButton, insideDialog } = require("../utils/util");

describe("Submit a sales report", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
    Navigate.gotoSales();
  })

  it("Successfully submits a sales report", () => {
    cy.contains("You have 4 retail location(s) that are missing Sales Reports");
    const wrapper = new Selector("tr").addIndex("0").build();
    cy.wait(1000);
    inside(wrapper, () => {
      const selector = new Selector("button").addProperty("tabIndex", "0").build();
      cy.get(selector).contains("Select").parent().click();
    })
    cy.contains("Test business name").should('be.visible');
    UserAction.uploadSalesReport('salesReport.csv')
    cy.contains("Your CSV file has been mapped successfully.");
    clickButton("Next");
    cy.contains("Please carefully check the information before selecting “Confirm Submission”.");
    clickButton("Confirm Submission");
    cy.contains("Confirm Your Submission and Acknowledge");
    insideDialog(() => {
      UserAction.clickFirstCheckBox();
      cy.wait(1000);
      clickButton("Confirm");
    })
    cy.contains("Thank you!");
  })
})