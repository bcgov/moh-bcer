import crypto from "crypto";
import 'cypress-file-upload';

const authBaseUrl = Cypress.env("auth_base_url");
const realm = Cypress.env("auth_realm");
const client_id = Cypress.env("auth_client_id");

const login = (user) => {
  cy.fixture("users/" + user).then((userData) => {
    const base64URLEncode = (str) => {
      return str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    };

    const code_challenge = base64URLEncode(crypto.randomBytes(32));
    const authCompleteUrl =
      authBaseUrl + "/realms/" + realm + "/protocol/openid-connect/auth";
    const queryObject = {
      client_id: client_id,
      redirect_uri: "http%3A%2F%2Flocalhost%3A3000%2Fretailer%2F%23%2Fkeycloak",
      response_mode: "fragment",
      response_type: "code",
      scope: "openid",
      code_challenge,
      code_challenge_method: "S256",
    };
    const queryString = Object.keys(queryObject)
      .map(function (key) {
        return key + "=" + queryObject[key];
      })
      .join("&");
    const url = authCompleteUrl + "?" + queryString;
    cy.request({
      url,
      followRedirect: true,
    })
      .then(function (response) {
        let html = document.createElement("html");
        html.innerHTML = response.body;
        let form = html.getElementsByTagName("form")[0];
        let url = form.action;
        return cy.request({
          method: "POST",
          url: url,
          followRedirect: true,
          form: true,
          body: {
            username: userData.username,
            password: userData.password,
          },
        });
      })
      .then(function (response) {
        expect(response.status).equal(200);
      });
  });
};

Cypress.Commands.add("kcLogout", function () {
  Cypress.log({ name: "Logout" });
  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
  });
});

Cypress.Commands.add("kcLogin", (user) => {
  Cypress.log({ name: "Login" });
  login(user);
});


/**
 * 
 * React rerender sometimes causes issue with detached from DOM elements being clicked
 * Found this solution at: https://github.com/cypress-io/cypress/issues/5743#issuecomment-650421731
 * 
 * getAttached(selector)
 * getAttached(selectorFn)
 *
 * Waits until the selector finds an attached element, then yields it (wrapped).
 * selectorFn, if provided, is passed $(document). Don't use cy methods inside selectorFn.
 */
 Cypress.Commands.add("getAttached", selector => {
  const getElement = typeof selector === "function" ? selector : $d => $d.find(selector);
  let $el = null;
  return cy.document().should($d => {
    $el = getElement(Cypress.$($d));
    expect(Cypress.dom.isDetached($el)).to.be.false;
  }).then(() => cy.wrap($el));
});


