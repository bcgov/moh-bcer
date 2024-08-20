/// <reference types="cypress" />

import { Navigate } from "../../utils/navigate"

describe("Successfully logs in the application", () => {
  beforeEach(() => {
    Navigate.loginPortal()
  })

  it("Shows the dashboard page in data portal", () => {
    cy.contains("Businesses Overview")
  })
})