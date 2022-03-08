import { clickButton } from "./util";

export class Navigate {
  static loginUser() {
    cy.kcLogout();
    cy.kcLogin("user");
  }

  static loginRetailer(){
    this.loginUser();
    cy.visit("/retailer");
  }

  static openBusinessSubmissionOnFirstLogin() {
    this.loginRetailer();
    clickButton("Start");
  }

  static openLocationManualInputForm() {
    cy.get('input[type="radio"][value="manual"]').check();
    clickButton("Add Location")
  }
}