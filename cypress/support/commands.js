import crypto from "crypto";
import 'cypress-file-upload';

const authBaseUrl = Cypress.env("auth_base_url"); //https://common-logon-test.hlth.gov.bc.ca/auth
const realm = Cypress.env("auth_realm"); //bcer
const client_id = Cypress.env("auth_client_id"); //BCER

const login = (user) => {
  cy.fixture("users/" + user).then((userData) => {
    const base64URLEncode = (str) => {
      return str
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
    };

    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());

    const authCompleteUrl = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/auth`; 

    const queryObject = {
      client_id: client_id,
      redirect_uri: encodeURIComponent("http://localhost:3000/retailer/#/"),
      response_mode: "fragment",
      response_type: "code",
      scope: "openid",
      kc_idp_hint: "moh_idp",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };
    
    const queryString = `client_id=${queryObject.client_id}&redirect_uri=${queryObject.redirect_uri}&response_mode=${queryObject.response_mode}&response_type=${queryObject.response_type}&scope=${queryObject.scope}&kc_idp_hint=${queryObject.kc_idp_hint}&code_challenge=${queryObject.code_challenge}&code_challenge_method=${queryObject.code_challenge_method}`;    

    const url = `${authCompleteUrl}?${queryString}`; //keycloak auth url, redirect the user to the keycloak login page

    cy.request({ url, followRedirect: true }).then((response) => {
      const html = document.createElement("html");
      html.innerHTML = response.body;
      const form = html.getElementsByTagName("form")[0];
      const formActionUrl = form.action;
      return cy.request({
        method: "POST",
        url: formActionUrl,
        followRedirect: true,
        form: true,
        body: {
          username: userData.username,
          password: userData.password,
        },
      });
    })
    .then((response) => {
      cy.log('Login Response:', response);
      expect(response.status).to.equal(200);
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


