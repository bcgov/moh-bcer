import React, { lazy, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core';

import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { AppGlobalContext, AppGlobalProvider } from '@/contexts/AppGlobal';
import { ErrorMessage } from 'formik';

const BusinessOwner = lazy(() => import(`@/views/BusinessOwner`));

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




// TODO
// fetch business owner details post Login
// pass to BO component and Header

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.appBody}>
        <SideNav />
        <BusinessOwner />
      </div>
    </div>
  );
};

export default App;
