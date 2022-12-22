/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";
import { clickButton, insideDialog } from "../../utils/util";
import { UserAction } from "../../utils/userAction";

describe("Tests the location details page", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.wait(1000);
    cy.contains("Submitted Locations").click();
    cy.wait(1000);
    cy.contains("Test business name").click();
  });

  it("Displays the user details correctly", () => {
    cy.wait(1000);
    cy.contains("Test1 User1");
    cy.contains("sagarbhp@gmail.com");
  });

  it("Displays the location information correctly", () => {
    cy.wait(1000);
    cy.contains("Physical");
  });

  it("Displays number of number of reports submitted properly", () => {
    cy.contains("1 products submitted");
    cy.contains("1 manufacturing reports submitted");
    cy.contains("0 sales reports submitted");
  })

  it("Click and Close the Close Location Dialog box", () => {
    cy.contains("Location Status");
    cy.contains("Open");
    cy.contains("Close").click();
    insideDialog(() => {
      clickButton("Cancel");
    });
    cy.contains("Open");
  })

  it("Close a location", () => {
    cy.contains("Location Status");
    cy.contains("Open");
    cy.contains("Close").click();
    insideDialog(() => {
      UserAction.clickFirstCheckBox("confirmed");
      clickButton("Confirm");
    });    
    cy.contains("Closed");
    cy.contains("Closed At");
  });

  it("Reactivate and validate location re-activation", () => {   
    cy.exec('npm run update:LocationCloseStatus').its('code').should('eq', 0);    
    cy.wait(1000);
    cy.contains("Location Status");
    cy.contains("Open");
    cy.contains("Close");
  })
});
