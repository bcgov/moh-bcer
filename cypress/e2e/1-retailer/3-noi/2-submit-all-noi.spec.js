/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton, insideDialog } from "../../utils/util";

describe("Tests the submissiong flow of all outstanding NOI", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
  })

  it("Submits all outstanding NOI", () => {
    Navigate.gotoNoi();
    cy.get(".MuiButton-contained").contains("Submit Outstanding NOI").click();
    cy.contains("Confirm and Submit Notice of Intent");
    cy.contains("You have 4 retail locations")
    UserAction.clickSelectAllRowsInTable();
    cy.get("button").contains("Submit").parent().should("not.be.disabled").click();
    insideDialog(() => {
      cy.contains("Confirm Your Submission")
      UserAction.clickFirstCheckBox();
      clickButton("Submit Now")
    })
    cy.contains("Your Notice of Intent has been submitted.");
    cy.contains("Next steps")
  })

  it("Tests that Dashboard shows no pending NOI", () => {
    cy.contains("Outstanding Reports");
    cy.contains("0 locations with outstanding Notice of Intent")
  })

  it("Tests that NOI tables are properly updated", () => {
    Navigate.gotoNoi();
    cy.contains("You have 0 retail locations that need a Notice of Intent");
    cy.contains("You have 4 retail locations. You can download/print the Notice of Intent for your Active locations.")
  })
})