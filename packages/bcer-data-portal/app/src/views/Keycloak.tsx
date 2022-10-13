import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import store from 'store';
import { HealthAuthority } from '@/constants/localEnums';

export default function KeycloakRedirect () {
  const [keycloak] = useKeycloak();

  const setUserHealthAuthority = (username: any) => {
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
      }).catch(function() {
          console.error('Failed to load user profile');
      });
    }
  }, [])

  return keycloak.authenticated
    ?
      <Redirect to='/' />
    :
      keycloak.loginRequired
    ?
      <Redirect to='/login' />
    :
      <h4>Authenticating...</h4>
}
