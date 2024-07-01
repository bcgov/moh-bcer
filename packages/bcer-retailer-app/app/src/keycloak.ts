import Keycloak from 'keycloak-js';

const keycloak: Keycloak = new (Keycloak as any)({
  realm: process.env.KEYCLOAK_REALM,
  url: process.env.BASE_KEYCLOAK_URL,
  clientId: process.env.KEYCLOAK_CLIENTID,
  silentCheckSsoFallback: false,
  onLoad: "login-required"
});
export default keycloak;
