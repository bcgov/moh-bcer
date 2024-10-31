import React, { lazy, Suspense, useEffect, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import LinearProgress from '@mui/material/LinearProgress';

import { AppGlobalContext, AppGlobalProvider } from '@/contexts/AppGlobal';
import { useKeycloak } from '@react-keycloak/web';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { theme } from '@/theme';
import keycloakConfig from './keycloak';

import '@/App.scss';
import '@bcgov/bc-sans/css/BC_Sans.css';
import keycloak from './keycloak';
import store from 'store';
import { ToastProvider } from './contexts/Toast';
import Toast from './components/generic/Toast';
import { ConfigProvider } from './contexts/Config';

declare module '@mui/material/styles' {
  interface DefaultTheme extends Theme {}
}

console.log("now at index.tsx")
const Login = lazy(() => import('./views/Login'));
const KeycloakRedirect = lazy(() => import('./views/Keycloak'));
const App = lazy(() => import('./App'));

const Loader = () => (
  <LinearProgress
    style={{ borderRadius: '5%', height: '5px', width: '100vw' }}
  />
);

const PrivateRoute = ({ Component }: { Component: React.ElementType }) => {
  const { initialized, keycloak } = useKeycloak();
  if (!initialized) {
    console.error('Not initialized.')
    return null
  }
  if (!keycloak) {
    console.error('Keycloak is null.')
    return null
  }
  if (keycloak.loginRequired) {
    console.error('Keycloak login required.')
    return <Navigate to="/login" replace />
  }
  if (!keycloak.authenticated) {
    console.error('Keycloak not authenticated.')
    return <Navigate to="/login" replace />
  }
  return <Component />;
};

const PublicRoute = ({ Component }: { Component: React.ElementType }) => {
  const { initialized, keycloak } = useKeycloak();
  if (!initialized) {
    console.error('PublicRoute: useKeycloak is not initialized.')
    return null
  }

  if (!keycloak) {
    console.error('PublicRoute: Keycloak is null.')
    return null
  }

  return keycloak.authenticated ? <Navigate to="/" replace /> : <Component />;
};

const RoutesCustom = () => {
  const [appGlobal, setAppGlobal] = useState<AppGlobalContext>({
    networkErrorMessage: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (appGlobal.networkErrorMessage) {
      setSnackbarOpen(true);
    }
  }, [appGlobal, appGlobal.networkErrorMessage]);

  return (
    <HashRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AppGlobalProvider value={[appGlobal, setAppGlobal]}>
            <ConfigProvider>
              <ToastProvider>
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route path="/login" element={<PublicRoute Component={Login} />} />
                    <Route path="/keycloak" element={<KeycloakRedirect />} />
                    <Route path="*" element={<PrivateRoute Component={App} />}/>
                  </Routes>
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
      </StyledEngineProvider>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ReactKeycloakProvider
    authClient={keycloakConfig}
    autoRefreshToken={true}
    initOptions={{
      pkceMethod: 'S256',
    }}
    onTokens={() => {
      store.set('TOKEN', keycloak.token);
    }}
    LoadingComponent={<Loader />}
  >
    <RoutesCustom />
  </ReactKeycloakProvider>,
);
