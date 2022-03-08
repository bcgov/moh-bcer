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
}