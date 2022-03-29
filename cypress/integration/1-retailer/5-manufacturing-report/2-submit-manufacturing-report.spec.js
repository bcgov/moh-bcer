/// <reference types="cypress" />

import { FillForm } from "../../utils/fillForm";
import { Navigate } from "../../utils/navigate"
import { UserAction } from "../../utils/userAction";
import { clickButton, insideDialog } from "../../utils/util";

describe("Tests uploading and submission of manufacturing report", () => {
  beforeEach(() => {
    Navigate.loginRetailer();
    cy.wait(1000);
  })

  it("Submit a manufacturing report to all concerned locations", () => {
    Navigate.gotoManufacturing();
    cy.get(".MuiButton-contained").contains("Submit Manufacturing Report").click();
    cy.contains("Add Manufacturing Report");
    FillForm.fillManufacturingForm(2);
    cy.wait(1000);
    UserAction.clickSelectAllRowsInTable();
    clickButton("Submit");
    cy.contains("Confirm Your Submission and Acknowledge");
    insideDialog(() => {
      UserAction.clickFirstCheckBox();
      clickButton("Confirm");
    })
    cy.contains("Your Manufacturing Report has been uploaded.");
  })

  it("Checks that Dashboard manufacturing has been properly updated", () => {
    cy.contains("No Outstanding Reports");
  })
})