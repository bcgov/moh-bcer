import React, { useContext, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

import Header from '@/components/Header';
import Locations from './views/Locations';
import ViewLocation from './views/ViewLocation';
import GetHelp from './views/GetHelp';
import FAQManagement from './views/FAQManagement';
import UserManagement from './views/UserManagement/Overview';
import Navigator from './components/nav/Navigator';
import { routes } from './constants/routes';
import SendNotification from './views/SendNotification';
import Map from './views/Map/Overview';
import { ConfigContext } from './contexts/Config';
import Dashboard from './views/Dashboard/Overview';
import BusinessDetails from './views/BusinessDetails/Overview';
import { useAxiosPost } from './hooks/axios';
import { AppGlobalContext } from './contexts/AppGlobal';
import { formatError } from './util/formatting';
import MapMenu from './views/MapMenu';
import MobileNav from './components/nav/MobileNav';
import Report from './views/Report/Overview';

const Root = styled('div')(({ theme }) => ({
  minHeight: '100vh',
}));

const Nav = styled('div')(({ theme }) => ({
  paddingTop: '70px',
  flex: '1',
  maxWidth: '100%',
  [theme.breakpoints.down('sm')]: {
    paddingTop: 62,
    position: 'fixed',
    width: '100%',
    zIndex: 99999999
  }
}));

const AppBody = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1',
  maxWidth: '100%',
  [theme.breakpoints.down('sm')]: {
    paddingTop: 90
  }
}));

const App = () => {
  const location = useLocation();
  const { config } = useContext(ConfigContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [{error}] = useAxiosPost('/data/user/profile');

  useEffect(() => {
    if(error){
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error)
      })
    }
  }, [error])

  return (
    <Root>
      <div>
        <Header />
        {location.pathname !== routes.map && (
          <Nav>
            {isSmUp ? <Navigator /> : <MobileNav />}
          </Nav>
        )}
      </div>
      <AppBody>
        <Routes>
          <Route path={routes.root} element={<Dashboard />} />
          <Route path={routes.submittedLocations} element={<Locations />} />
          <Route path={`${routes.viewLocation}/:id`} element={<ViewLocation />} />
          <Route path={routes.getHelp} element={<GetHelp />} />
          <Route path={routes.FAQManagement} element={<FAQManagement />} />
          <Route path={routes.userManagement} element={<UserManagement />} />
          {config.featureFlags.TEXT_MESSAGES && <Route path={routes.sendNotification} element={<SendNotification />} />}
          <Route path={routes.map} element={<Map />} />
          <Route path={`${routes.viewBusiness}/:id`} element={<BusinessDetails />} />
          <Route path={routes.mapMenu} element={<MapMenu />} />
          <Route path={routes.report} element={<Report />} />
        </Routes>
      </AppBody>
    </Root>
  );
};

export default App;