import React, { lazy, Suspense, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { KeycloakProvider } from '@react-keycloak/web';
import LinearProgress from '@material-ui/core/LinearProgress';

import { AppGlobalContext, AppGlobalProvider } from '@/contexts/AppGlobal';
import { useKeycloak } from '@react-keycloak/web';
import { Snackbar } from '@material-ui/core';
import { theme } from '@/theme';
import keycloakConfig from './keycloak';

import '@/App.scss';
import '@bcgov/bc-sans/css/BCSans.css';
import keycloak from './keycloak';
import store from 'store';
import { ToastProvider } from './contexts/Toast';
import Toast from './components/generic/Toast';
import { ConfigProvider } from './contexts/Config';

const Login = lazy(() => import('./views/Login'));
const KeycloackRedirect = lazy(() => import('./views/Keycloak'));
const App = lazy(() => import('./App'));

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const [keycloak] = useKeycloak();
  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak.authenticated && !keycloak.loginRequired ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const PublicRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const [keycloak] = useKeycloak();
  return (
    <Route
      {...rest}
      render={(props) =>
        !keycloak.authenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

const Loader = () => (
  <LinearProgress
    style={{ borderRadius: '5%', height: '5px', width: '100vw' }}
  />
);

const Routes = () => {
  const [appGlobal, setAppGlobal] = useState<AppGlobalContext>({
    networkErrorMessage: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (appGlobal.networkErrorMessage) {
      setSnackbarOpen(true);
    }
  }, [appGlobal.networkErrorMessage]);

  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <AppGlobalProvider value={[appGlobal, setAppGlobal]}>
          <ConfigProvider>
            <ToastProvider>
              <Suspense fallback={<Loader />}>
                <Switch>
                  <PublicRoute path="/login" component={Login} />
                  <Route path="/keycloak" component={KeycloackRedirect} />
                  <PrivateRoute path="/" component={App} />
                </Switch>
              </Suspense>
              <Toast />
            </ToastProvider>
            </ConfigProvider>
        </AppGlobalProvider>
      </ThemeProvider>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={appGlobal.networkErrorMessage}
        autoHideDuration={6000}
        key={appGlobal.networkErrorMessage}
        ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
      />
    </HashRouter>
  );
};

render(
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
  </KeycloakProvider>,
  document.getElementById('root')
);
