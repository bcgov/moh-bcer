import React, { lazy, Suspense, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { KeycloakProvider } from '@react-keycloak/web';
import LinearProgress from '@material-ui/core/LinearProgress';

import { AppGlobalContext, AppGlobalProvider } from '@/contexts/AppGlobal';
import { useKeycloak } from '@react-keycloak/web';
import { IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { theme } from '@/theme';
import keycloakConfig from './keycloak';

import '@/App.scss';
import '@bcgov/bc-sans/css/BCSans.css';
import keycloak from './keycloak';
import store from 'store';

const Signup = lazy(() => import('./views/Register'));
const Login = lazy(() => import('./views/Login'));
const KeycloackRedirect = lazy(() => import('./views/Keycloak'));
const App = lazy(() => import('./App'));

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const [keycloak] = useKeycloak();
  return (
    <Route
      {...rest}
      render={props =>
        keycloak.authenticated && !keycloak.loginRequired ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
};

const PublicRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const [keycloak] = useKeycloak();
  return (
    <Route
      {...rest}
      render={props =>
        !keycloak.authenticated ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

const Loader = () => (
  <LinearProgress style={{ borderRadius: '5%', height: '5px', width: '95vw', margin: 'auto' }} />
)

const Routes = () => {
  const [appGlobal, setAppGlobal] = useState<AppGlobalContext>({
    myBusinessComplete: false,
    noiComplete: false,
    productReportComplete: false,
    manufacturingReportComplete: false,
    networkErrorMessage: ''
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  useEffect(() => {
    if (appGlobal.networkErrorMessage) {
      setSnackbarOpen(true)
    }
  }, [appGlobal.networkErrorMessage])

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <AppGlobalProvider value={[appGlobal, setAppGlobal]}>
          <Suspense fallback={<Loader />}>
            <Switch>
              <PublicRoute path='/login' component={Login} />
              <PublicRoute path='/signup' component={Signup} />
              <Route path='/keycloak' component={KeycloackRedirect} />
              <PrivateRoute path='/' component={App} />
            </Switch>
          </Suspense>
        </AppGlobalProvider>
      </ThemeProvider>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={appGlobal.networkErrorMessage}
        key={appGlobal.networkErrorMessage}
        ClickAwayListenerProps={{mouseEvent: false,touchEvent: false}}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </HashRouter>
  );
};

render((
  <KeycloakProvider
    keycloak={keycloakConfig}
    autoRefreshToken={true}
    initConfig={{
      pkceMethod: 'S256',
    }}
    onTokens={() => {
      store.set('TOKEN', keycloak.token);
     }}
    LoadingComponent={<Loader />}
  >
    <Routes />
  </KeycloakProvider>
), document.getElementById('root'));
