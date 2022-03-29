/// <reference types="cypress" />

const { Navigate } = require("../utils/navigate");
const { UserAction } = require("../utils/userAction");
const { insideDialog, clickButton } = require("../utils/util");

describe("Tests renewal of NOI", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  })

  it("Contains correct number of missing reports", () => {
    cy.contains("2 locations with outstanding Notice of Intent");
    cy.contains("1 locations with outstanding Sales Report");
  })

  it("Shows correct number of location in noi tables", () => {
    Navigate.gotoNoi();
    cy.contains("You have 1 retail locations that need a Notice of Intent");
    cy.contains("You have 1 locations that require a Sales Report before their NOI can be renewed.");
  })

  it("Renews NOI", () => {
    Navigate.gotoNoi();
    cy.get(".MuiButton-contained").contains("Submit Outstanding NOI").click();
    cy.contains("Confirm and Submit Notice of Intent");
    cy.contains("You have 1 retail locations");
    UserAction.clickSelectAllRowsInTable();
    cy.get("button").contains("Submit").parent().should("not.be.disabled").click();
    insideDialog(() => {
      cy.contains("Confirm Your Submission")
      UserAction.clickFirstCheckBox();
      clickButton("Submit Now")
    })
    cy.contains("Your Notice of Intent has been submitted.");
    cy.contains("Next steps");
  })
})