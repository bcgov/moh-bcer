/// <reference types="cypress" />

describe('Testing dashboard for first time login', () => {
  beforeEach(() => {
    cy.kcLogout();
    cy.kcLogin('user');
    cy.visit('/retailer')
  })

  it('Asks the user to create a new business', () => {
    cy.contains("Welcome to E-Substances Reporting Application");
  })

  it('Starts business fill up form', () => {
    cy.contains("Start").click();
  })
})