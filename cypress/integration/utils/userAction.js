import { FillForm } from "./fillForm";
import { Navigate } from "./navigate";
import { clickButton, insideDialog, Selector } from "./util";

export class UserAction {
  static submitBusinessInfo() {
    cy.wait(1000);
    cy.get("button").contains("Next").click();
    cy.wait(1000);
    cy.get("button").contains("Next").click();
    cy.wait(1000);
    cy.get("button").contains("Submit Business Information").click();
    cy.wait(1000);
  }

  static clickEditExistingLocation(position) {
    let selector = new Selector("tr")
      .addIndex(`${position}`)
      .addSelector("td")
      .addSelector("button")
      .addTitle("Edit Location")
      .build();
    cy.wait(1000);
    cy.get(selector).first().click();
  }

  static addNewLocationManually(locations) {
    locations.forEach((l) => {
      Navigate.openLocationManualInputForm();
      FillForm.fillManualLocationForm(l);
      cy.wait(1000);
      clickButton("Submit");
    });
  }

  static addLocationFileUpload(filename) {
    const radioSelector = new Selector("input")
      .addType("radio")
      .addValue("upload")
      .build();
    cy.get(radioSelector).should("exist").click();
    cy.contains("Drag your locations here")
    cy.get("div")
      .contains("Drag your locations here")
      .parent()
      .parent()
      .parent()
      .attachFile("files/" + filename, { subjectType: "drag-n-drop" });
      cy.wait(1000)
      cy.get(".MuiSnackbar-root", { timeout: 10000 }).should("not.exist")
    insideDialog(() => {
      clickButton("Map Headers");
    });
    clickButton("Next");
  }

  static clickEditOnNewLocationConfirm(position) {
    const selector = new Selector("tr")
    .addIndex(`${position}`)
    .addSelector("td")
    .addSelector("div")
    .addSelector("button")
    .addTitle("Editing Location")
    .build();
    cy.get(selector).first().click();
  }

  static clickDeleteOnNewLocationConfirm(position) {
    const selector = new Selector("tr")
    .addIndex(`${position}`)
    .addSelector("td")
    .addSelector("div")
    .addSelector("button")
    .addTitle("Deleting Location")
    .build();
    cy.get(selector).first().click();
  }

  static clickFirstCheckBox(name) {
    const selector = new Selector("input").addType("checkbox")
    if(name){
      selector.addName(name);
    }
    cy.get(selector.build()).first().click()
  }
}
