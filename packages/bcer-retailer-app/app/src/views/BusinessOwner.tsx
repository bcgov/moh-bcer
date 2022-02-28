import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import Welcome from '@/views/Welcome';
import GetHelp from '@/views/GetHelp';

import MyBusinessNav from '@/components/MyBusiness/MyBusinessNav';
import MyBusiness from '@/components/MyBusiness/Overview';
import MyBusinessSubmission from '@/components/MyBusiness/MyBusinessSubmission';

import NoiOverview from '@/views/NOI/Overview';
import NoiSubmit from '@/views/NOI/Submit';

import ManufacturingOverview from '@/views/Manufacturing/Overview';
import ManufacturingSubmit from '@/views/Manufacturing/Submit';
import ManufacturingReport from '@/views/Manufacturing/View';

import Location from '@/views/Location';

import ProductRoutes from '@/components/productReport/ProductRoutes';
import SalesRoutes from '@/components/Sales/SalesRoutes';

const useStyles = makeStyles({
  parent: {
    width: '100%',
    padding: '2rem 2rem 4rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1140px',
  }
});

const BusinessOwner = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.getElementById('root');
    el.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={classes.parent}>
      <div className={classes.contentWrapper}>
        <Switch>
          <Route exact path='/business/:step' component={MyBusinessNav} />
          <Route exact path='/myDashboard' component={MyBusiness} />
          <Route exact path='/submission/:submissionId' component={MyBusinessSubmission} />
          <Route exact path={['/noi', '/noi/success']} component={NoiOverview} />
          <Route exact path='/noi/submit' component={NoiSubmit} />
          <Route path='/products' component={ProductRoutes} />
          <Route exact path='/manufacturing' component={ManufacturingOverview} />
          <Route exact path='/manufacturing/submit' component={ManufacturingSubmit} />
          <Route exact path='/manufacturing/:reportId' component={ManufacturingReport} />
          <Route path='/sales' component={SalesRoutes} />
          <Route exact path='/view-location/:reportId' component={Location} />
          <Route exact path='/gethelp' component={GetHelp} />
          <Route path='/' render={() => <Welcome />} />
        </Switch>
      </div>
    </div>
  );
};
export default BusinessOwner;
