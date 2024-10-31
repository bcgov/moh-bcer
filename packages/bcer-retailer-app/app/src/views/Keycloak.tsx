import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import store from 'store';

export default function KeycloakRedirect () {
  const {keycloak} = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak.authenticated) {
      store.set('TOKEN', keycloak.token);
      navigate('/');
    } else if (keycloak.loginRequired) {
      navigate('/login');
    } else {
      navigate('/'); 
    }
  }, [keycloak.authenticated, keycloak.loginRequired, navigate]);

  return <h4>Authenticating...</h4>;
}