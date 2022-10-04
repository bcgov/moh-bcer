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
    cy.get(selector).first().click({ force: true });
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
    cy.contains("Drag your physical locations here")
    cy.get("div")
      .contains("Drag your physical locations here")
      .parent()
      .parent()
      .parent()
      .attachFile("files/" + filename, { subjectType: "drag-n-drop" });
    cy.wait(1000)
    cy.get(".MuiSnackbar-root", { timeout: 10000 }).should("not.exist")
    cy.contains("Your CSV file has been mapped successfully.");
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

  static clickSelectAllRowsInTable(){
    cy.get("table").first().should("exist").within(() => {
      const selector = new Selector("input").addType("checkbox").build();
      cy.get(selector).first().should("exist").click();
    })
  }

  static clickUploadProductRadioButton(){
    const selector = new Selector("input").addName("mode select").addType("radio").addValue("upload").build();
    cy.get(selector).should("exist").click();
  }

  static uploadProductReport(filename){
    this.clickUploadProductRadioButton();
    cy.wait(1000);
    cy.contains("Drop your product report here")
    cy.get("div")
      .contains("Drop your product report here")
      .parent()
      .parent()
      .parent()
      .attachFile("files/" + filename, { subjectType: "drag-n-drop" });
    cy.wait(1000)
    cy.get(".MuiSnackbar-root", { timeout: 10000 }).should("not.exist")
    cy.wait(1000);
  }

  static uploadSalesReport(filename){
    cy.contains("Drag your Sales Report here");
    cy.wait(1000);
    cy.get("div")
      .contains("Drag your Sales Report here")
      .parent()
      .parent()
      .parent()
      .attachFile("files/" + filename, { subjectType: "drag-n-drop" });
    cy.wait(1000);
    cy.get(".MuiSnackbar-root", { timeout: 10000 }).should("not.exist");
    cy.contains("Your CSV file has been mapped successfully.")
    cy.wait(1000);
  }

  static writeInInputByName(name, write, type){
    const selector = new Selector(type || "input").addName(name).build();
    cy.get(selector).type(write);
  }

  static clearInputByName(name, type){
    const selector = new Selector(type || "input").addName(name).build();
    cy.get(selector).clear();
  }

  static selectOption(name, option){
    const inputSelector = new Selector("input").addName(name).build();
    cy.get(inputSelector).parent().click();

    const optionSelector = new Selector("li").addProperty("role", "option").addProperty("data-value", option).build();
    cy.get(optionSelector).click();
  }

  static clickRadio(name, value){
    const selector = new Selector("input").addName(name).addValue(value).build();
    cy.get(selector).parent().click();
  }

  static businessSearch(category, correctInput, correctHA, wrongHA){
    cy.wait(1000)
    UserAction.selectOption("category", category);
    if(correctHA){
      UserAction.selectOption("healthAuthority", correctHA);
    }
    UserAction.writeInInputByName("search", correctInput);
    clickButton("Search");
    cy.contains("Test address line 1");
    UserAction.clearInputByName("search");
    UserAction.writeInInputByName("search", "wrong input");
    clickButton("Search");
    cy.contains("No records to display");
    if(wrongHA){
      UserAction.clearInputByName("search");
      UserAction.selectOption("healthAuthority", wrongHA);
      UserAction.writeInInputByName("search", correctInput);
      clickButton("Search");
      cy.contains("No records to display");
    }
  }

  static userSearch(type, correctInput){
    cy.wait(1000);
    UserAction.selectOption("type", type);
    UserAction.writeInInputByName("search", correctInput);
    clickButton("Search");
    cy.contains("Test1 User1");
    UserAction.clearInputByName("search");
    UserAction.writeInInputByName("search", "wrong input");
    clickButton("Search");
    cy.contains("No records to display");
  }
}
