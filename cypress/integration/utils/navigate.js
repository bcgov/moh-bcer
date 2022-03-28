import { clickButton, Selector } from "./util";

export class Navigate {
  static loginUser(name="user") {
    cy.kcLogout();
    cy.kcLogin(name);
  }

  static loginRetailer(name) {
    this.loginUser(name);
    cy.visit("/retailer");
  }

  static loginPortal(name="admin") {
    this.loginUser(name);
    cy.visit("/portal")
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
    cy.wait(1000);
    cy.get(new Selector("a").addHref("/business/details").build()).should('be.visible').click({force: true});
  }

  static gotoNoi() {
    cy.wait(1000);
    cy.get(new Selector("a").addHref("/noi").build()).should("be.visible").click({force: true});
  }

  static gotoProducts() {
    cy.wait(1000);
    cy.get(new Selector("a").addHref("/products").build()).should("be.visible").click({force: true});
  }

  static gotoManufacturing() {
    cy.wait(1000);
    cy.get(new Selector("a").addHref("/manufacturing").build()).should("be.visible").click({force: true});
  }

  static gotoSales() {
    cy.get(new Selector("a").addHref("sales").build()).click();
  }
}
