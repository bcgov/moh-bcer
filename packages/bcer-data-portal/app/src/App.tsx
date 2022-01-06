import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core';

import Header from '@/components/Header';
import Locations from './views/Locations';
import GetHelp from './views/GetHelp';
import UserManagement from './views/UserManagement/Overview';
import Navigator from './components/Navigator';
import { routes } from './constants/routes';
import Map from './views/Map/Overview';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
  },
  nav: {
    paddingTop: '70px',
    flex: '1',
    maxWidth: '100%',
  },
  appBody: {
    display: 'flex',
    flex: '1',
    maxWidth: '100%',
  },
});

const App = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <div>
        <Header />
        {history.location.pathname != routes.map && (
          <div className={classes.nav}>
            <Navigator />
          </div>
        )}
      </div>
      <div className={classes.appBody}>
        <Switch>
          <Route exact path={routes.root} component={Locations} />
          <Route exact path={routes.getHelp} component={GetHelp} />
          <Route exact path={routes.userManagement} component={UserManagement} />
          <Route exact path={routes.map} component={Map} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
