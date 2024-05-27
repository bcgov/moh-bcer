import React, { lazy, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { AppGlobalContext, AppGlobalProvider } from '@/contexts/AppGlobal';
import { ErrorMessage } from 'formik';

const PREFIX = 'App';

const classes = {
  root: `${PREFIX}-root`,
  appBody: `${PREFIX}-appBody`
};

const Root = styled('div')({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  [`& .${classes.appBody}`]: {
    display: 'flex',
    flex: '1',
    maxWidth: '100%',
    paddingTop: '70px',
  }
});

const BusinessOwner = lazy(() => import(`@/views/BusinessOwner`));

// TODO
// fetch business owner details post Login
// pass to BO component and Header

const App = () => {

  return (
    <Root className={classes.root}>
      <Header />
      <div className={classes.appBody}>
        <SideNav />
        <BusinessOwner />
      </div>
    </Root>
  );
};

export default App;
