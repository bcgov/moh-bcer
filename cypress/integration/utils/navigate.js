import { clickButton, Selector } from "./util";

export class Navigate {
  static loginUser() {
    cy.kcLogout();
    cy.kcLogin("user");
  }

  static loginRetailer() {
    this.loginUser();
    cy.visit("/retailer");
  }

  static openBusinessSubmissionOnFirstLogin() {
    this.loginRetailer();
    clickButton("Start");
  }

  static openLocationManualInputForm() {
    const selector = new Selector('input').addType("radio").addValue("manual").build();
    cy.get(selector).check();
    clickButton("Add Location");
  }

  static gotoRetailerDashBoard() {
    cy.get(new Selector("a").addHref("/myDashboard").build()).click();
  }

  static gotoMyBusiness() {
    cy.get(new Selector("a").addHref("/business/details").build()).should('be.visible').click({force: true});
  }

  static gotoNoi() {
    cy.get(new Selector("a").addHref("/noi").build()).click();
  }

  static gotoProducts() {
    cy.get(new Selector("a").addHref("/products").build()).click();
  }

  static gotoManufacturing() {
    cy.get(new Selector("a").addHref("/manufacturing").build()).click();
  }

  static gotoSales() {
    cy.get(new Selector("a").addHref("sales").build()).click();
  }
}
