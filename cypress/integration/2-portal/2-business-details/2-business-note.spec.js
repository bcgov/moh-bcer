/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate";
import { UserAction } from "../../utils/userAction";
import { checkButtonIsDisabled, checkInputValue, clickButton, Selector } from "../../utils/util";

describe("Tests notes functionality in business details page", () => {
  Cypress.on("uncaught:exception", () => {
    return false;
  });
  beforeEach(() => {
    Navigate.loginPortal();
    cy.contains("Test business name").parent().click();
    cy.wait(1000);
  });

  it("Creates a brand new note", () => {
    cy.contains("No one has made an edit on this note yet");
    checkButtonIsDisabled("Save");
    UserAction.writeInInputByName(
      "content",
      "This is the first note",
      "textarea"
    );
    clickButton("Save");
    cy.contains("Test User edited on");
    checkButtonIsDisabled("Save");
  });

  it("Checks that note was successfully displayed in text area and updates", () => {
    checkInputValue("content", "This is the first note", "textarea");
    UserAction.clearInputByName("content", "textarea");
    UserAction.writeInInputByName("content", "This is the second note", "textarea");
    clickButton("Save");
  })

  it("Checks that updated note was displayed successfully", () => {
    checkInputValue("content", "This is the second note", "textarea");
  })
});
