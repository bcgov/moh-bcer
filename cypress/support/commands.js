const crypto = require('crypto');
const authBaseUrl = Cypress.env('KEYCLOAK_LOCAL_AUTH_URL') || Cypress.env('auth_base_url');

const localLogin = (user) => {
  cy.fixture('users/' + user).then((userData) => {
    let realm = Cypress.env('auth_realm');
    let client_id = Cypress.env('auth_client_id');

    const base64URLEncode = (str) => {
      return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const code_challenge = base64URLEncode(crypto.randomBytes(32));
    const authCompleteUrl = authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/auth';
    const queryObject = {
      client_id: client_id,
      redirect_uri: 'http%3A%2F%2Flocalhost%3A3000%2Fretailer%2F%23%2Fkeycloak',
      response_mode: 'fragment',
      response_type: 'code',
      scope: 'openid',
      code_challenge,
      code_challenge_method: 'S256',
    };
    const queryString = Object.keys(queryObject)
      .map(function (key) {
        return key + '=' + queryObject[key];
      })
      .join('&');
    const url = authCompleteUrl + '?' + queryString;
    cy.request({
      url,
      followRedirect: true,
    })
      .then(function (response) {
        let html = document.createElement('html');
        html.innerHTML = response.body;
        let form = html.getElementsByTagName('form')[0];
        let url = form.action;
        return cy.request({
          method: 'POST',
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

const pipelineLogin = (user) => {
  cy.fixture('users/' + user).then((userData) => {
    let realm = Cypress.env('auth_realm');
    let client_id = Cypress.env('auth_client_id');
    let client_secret = Cypress.env('KEYCLOAK_LOCAL_SECRET');

    const base64URLEncode = (str) => {
      return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const code_challenge = base64URLEncode(crypto.randomBytes(32));

    cy.request({
      url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/auth',

      followRedirect: false,
      qs: {
        scope: 'openid',
        response_type: 'code',
        approval_prompt: 'auto',
        redirect_uri: Cypress.config('baseUrl'),
        client_id: client_id,
        client_secret: client_secret,
        code_challenge_method: 'plain',
        code_challenge,
      },
    })
      .then(function (response) {
        let html = document.createElement('html');
        html.innerHTML = response.body;
        let form = html.getElementsByTagName('form')[0];
        let url = form.action;
        return cy.request({
          method: 'POST',
          url: url,
          followRedirect: false,
          form: true,
          body: {
            username: userData.username,
            password: userData.password,
          },
        });
      })
      .then(function (response) {
        let code = getAuthCodeFromLocation(response.headers['location']);
        cy.request({
          method: 'post',
          url: authBaseUrl + '/realms/' + realm + '/protocol/openid-connect/token',
          body: {
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: Cypress.config('baseUrl'),
            code: code,
            code_verifier: code_challenge,
            grant_type: 'authorization_code',
          },
          form: true,
          followRedirect: false,
        }).its('body');
      });
  });
};

Cypress.Commands.add('kcLogout', function () {
  Cypress.log({ name: 'Logout' });
  let realm = Cypress.env('auth_realm');
  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
  });
});

Cypress.Commands.add('kcLogin', (user) => {
  Cypress.log({ name: 'Login' });
  // Change isLocal to true to enable local
  if (Cypress.env('isLocal') || true) {
    localLogin(user);
  } else {
    pipelineLogin(user);
  }
});

Cypress.Commands.add('kcLogout', function () {
  Cypress.log({ name: 'Logout' });
  let realm = Cypress.env('auth_realm');
  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`,
  });
});

Cypress.Commands.add('callAPI', ({ api, method = 'POST', body, followRedirect = false }) => {
  Cypress.log({ name: 'call-api' });
  let realm = Cypress.env('KEYCLOAK_REALM');
  let client_id = Cypress.env('KEYCLOAK_API_CLIENTID');
  let client_secret = Cypress.env('KEYCLOAK_LOCAL_SECRET');

  // Get super user token
  cy.request({
    method: 'POST',
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
    followRedirect: false,
    form: true,
    body: {
      grant_type: 'password',
      client_id,
      scope: 'openid',
      client_secret,
      username: 'test-superuser',
      password: 'password',
    },
  }).then(({ body: respBody }) => {
    const accessToken = respBody.access_token;
    const apiBaseURL = Cypress.env('apiBaseURL');
    cy.request({
      url: `${apiBaseURL}${api}`,
      method,
      followRedirect,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body,
    });
  });
});


