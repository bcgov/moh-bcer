import React, { useContext, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Hidden, makeStyles } from '@material-ui/core';

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

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
  },
  nav: {
    paddingTop: '70px',
    flex: '1',
    maxWidth: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0
    }
  },
  appBody: {
    display: 'flex',
    flex: '1',
    maxWidth: '100%',
  },
}));

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  const { config } = useContext(ConfigContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  //Creates or updated logged in user in database
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
    <div className={classes.root}>
      <div>
        <Header />
        {history.location.pathname != routes.map && (
          <div className={classes.nav}>
            <Hidden smDown>
              <Navigator />
            </Hidden>
            <Hidden smUp>
              <MobileNav />
            </Hidden>
          </div>
        )}
      </div>
      <div className={classes.appBody}>
        <Switch>
          <Route exact path={routes.root} component={Dashboard} />
          <Route exact path={routes.submittedLocations} component={Locations} />
          <Route exact path={`${routes.viewLocation}/:id`} component={ViewLocation} />
          <Route exact path={routes.getHelp} component={GetHelp} />
          <Route exact path={routes.FAQManagement} component={FAQManagement} />
          <Route exact path={routes.userManagement} component={UserManagement} />
          { config.featureFlags.TEXT_MESSAGES && <Route exact path={routes.sendNotification} component={SendNotification} /> }
          <Route exact path={routes.map} component={Map} />
          <Route exact path={`${routes.viewBusiness}/:id`} component={BusinessDetails} />
          <Route exact path={routes.mapMenu} component={MapMenu} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
