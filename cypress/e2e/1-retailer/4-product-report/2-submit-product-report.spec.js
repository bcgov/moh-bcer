/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton, insideDialog } from "../../utils/util";

describe("Tests the submission flow of product report", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
    cy.wait(1000);
  })

  it("Test: Uploads product report with error", () => {
    Navigate.gotoProducts();
    cy.get(".MuiButton-contained").contains("Submit Product Report").click();
    cy.wait(1000);
    UserAction.uploadProductReport('productReportWithError.csv')
    cy.wait(1000)
    cy.get("button").contains("Download Errors CSV").parent().should("exist");
    cy.get("button").contains("Next").parent().should("exist").should("be.disabled");
  })

  it("Upload a valid product report for all locations", () => {
    Navigate.gotoProducts();
    cy.get(".MuiButton-contained").contains("Submit Product Report").click();
    cy.wait(1000);
    UserAction.uploadProductReport("productReport.csv");
    cy.get("button").should("not.contain", "Download Errors CSV");
    cy.wait(1000)
    clickButton("Next")
    cy.contains("Select Locations");
    cy.wait(1000)
    UserAction.clickSelectAllRowsInTable();
    clickButton("Submit");
    cy.contains("Confirm Your Submission and Acknowledge");
    insideDialog(() => {
      UserAction.clickFirstCheckBox();
      clickButton("Confirm")
    })
    cy.contains("Your Product Report has been submited.");
    cy.contains("Next steps")
  })

  it("Checks that dashboard was updated successfully", () => {
    cy.contains("Outstanding Reports")
    cy.contains("0 locations with outstanding Product Reports");
    cy.contains("Locations with complete reports");
  })
})