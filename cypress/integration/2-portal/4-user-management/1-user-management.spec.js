/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";
import { UserAction } from "../../utils/userAction";
import { clickButton, inside, insideDialog, Selector } from "../../utils/util";

describe("Tests the user management functionality", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.wait(1000);
    cy.contains("User Management").click();
  });

  it("Renders user management page without error", () => {
    cy.contains("Test1 User1");
  });

  it("Search with User Name works properly", () => {
    UserAction.userSearch("userName", "Test1");
  });

  it("Search with Business Name works properly", () => {
    UserAction.userSearch("businessName", "Test business name");
  });

  it("Search with Address works correctly", () => {
    UserAction.userSearch("address", "Test address line 1");
  });

  it("Search with email works properly", () => {
    UserAction.userSearch("emailAddress", "sagarbhp");
  });

  it("Assign a new user to existing business", () => {
    const selector = new Selector("tr").addIndex(2).build();
    inside(selector, () => {
      const selector = new Selector("button").addTitle("Edit User").build();
      cy.get(selector).click();
    });
    cy.wait(1000);
    cy.contains("Edit Info");
    insideDialog(() => {
      cy.get('input[type="text"]').type("T");
      cy.wait(1000);
    });
    cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
    cy.contains("The user will be able to access and update all the data from Test business name");
    insideDialog(() => UserAction.clickFirstCheckBox());
    cy.wait(1000);
    clickButton("Save Changes");
    cy.wait(3000);
    Navigate.loginRetailer("user2");
    cy.contains("No Outstanding Reports");
  });
});
