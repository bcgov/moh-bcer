import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import Header from '@/components/Header';
import Locations from './views/Locations';
import GetHelp from './views/GetHelp';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  appBody :{
    display: 'flex',
    flex: '1',
    maxWidth: '100%',
    paddingTop: '70px',
  }
});

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.appBody}>
        <Switch>
          <Route exact path='/' component={Locations} />
          <Route exact path='/getHelp' component={GetHelp} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
