import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import store from 'store';
import { HealthAuthority } from '@/constants/localEnums';

export default function KeycloakRedirect() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  console.log('keycloak.tsx file here', keycloak.token);
  const setUserHealthAuthority = (username: string) => {
    if (username.startsWith('iha')) {
      store.set('KEYCLOAK_USER_HA', HealthAuthority.INTERIOR);
    } else if (username.startsWith('nirhn') || username.startsWith('no')) {
      store.set('KEYCLOAK_USER_HA', HealthAuthority.NORTHERN);
    } else if (username.startsWith('sfhr')) {
      store.set('KEYCLOAK_USER_HA', HealthAuthority.FRASER);
    } else if (username.startsWith('viha')) {
      store.set('KEYCLOAK_USER_HA', HealthAuthority.ISLAND);
    } else if (username.startsWith('vrhb')) {
      store.set('KEYCLOAK_USER_HA', HealthAuthority.COASTAL);
    }
  }

  useEffect(() => {
    if (keycloak.authenticated) {
      store.set('TOKEN', keycloak.token);

      keycloak.loadUserInfo()
        .then((profile: any) => {
          const username = profile.preferred_username;
          setUserHealthAuthority(username);
          navigate('/');
        }).catch(function() {
          console.error('Failed to load user profile');
          navigate('/');
        });
    } else if (keycloak.loginRequired) {
      navigate('/login');
    }
  }, [keycloak.authenticated, keycloak.loginRequired, navigate]);

  if (!keycloak.authenticated && !keycloak.loginRequired) {
    return <h4>Authenticating...</h4>;
  }

  return null;
}