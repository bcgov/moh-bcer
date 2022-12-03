/// <reference types="cypress" />

import {
  businessFieldNames,
  businessInputErrorMessage,
} from "../../utils/business/businessObjects";
import { Navigate } from "../../utils/navigate";
import { stringGen } from "../../utils/util";

describe("Testing business details input form", () => {
  context("Fails the business input validations", function () {
    before(() => {
      Navigate.openBusinessSubmissionOnFirstLogin();
      cy.wait(1000);
    });
    it("Fails Business Legal Name field validation", () => {
      cy.get(businessFieldNames.legalName).type(stringGen(101)).blur();
      cy.contains(businessInputErrorMessage.legalName.length);
    });

    it("Fails Doing Business As field validation", () => {
      cy.get(businessFieldNames.businessName).type(stringGen(101)).blur();
      cy.contains(businessInputErrorMessage.businessName.length);
    });

    it("Fails Address line 1 field validation", () => {
      cy.get(businessFieldNames.addressLine1).type(stringGen(101)).blur();
      cy.contains(businessInputErrorMessage.addressLine1.length);
    });

    it("Fails Address line 2 filed validation", () => {
      cy.get(businessFieldNames.addressLine2).type(stringGen(101)).blur();
      cy.contains(businessInputErrorMessage.addressLine2.length);
    });

    it("Fails city field validation", () => {
      cy.get(businessFieldNames.city).type(stringGen(51)).blur();
      cy.contains(businessInputErrorMessage.city.length);
    });

    it("Fails postal code field validation", () => {
      const input = businessFieldNames.postal;
      cy.get(input).focus().blur();
      cy.contains(businessInputErrorMessage.postal.required);
      cy.get(input).type(stringGen(4)).blur();
      cy.contains(businessInputErrorMessage.postal.valid);
    });

    it("Fails Business phone number validation", () => {
      const input = businessFieldNames.phone;
      cy.get(input).focus().blur();
      cy.contains(businessInputErrorMessage.phone.required);
      cy.get(input).type(stringGen(4)).blur();
      cy.contains(businessInputErrorMessage.phone.valid);
    })

    it("Fails Business email field validation", () => {
      const input = businessFieldNames.email;
      cy.get(input).focus().blur();
      cy.contains(businessInputErrorMessage.email.required);
      cy.get(input).type(stringGen(10)).blur();
      cy.contains(businessInputErrorMessage.email.valid);
    })

    it("Fails Business webpage field validation", () => {
      const input = businessFieldNames.webPage;
      cy.get(input).type(stringGen(101)).blur();
      cy.contains(businessInputErrorMessage.webPage.length);
    })
  });
});
