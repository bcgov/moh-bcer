const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'kq594r',
  viewportHeight: 700,
  viewportWidth: 1200,
  requestTimeout: 2000,
  defaultCommandTimeout: 5000,
  retries: 3,
  env: {
    auth_base_url: 'https://common-logon-test.hlth.gov.bc.ca/auth',
    auth_realm: 'bcer',
    auth_client_id: 'BCER',
    chromeWebSecurity: false,
    video: false,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
