import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Route, Routes, useLocation } from 'react-router-dom';

import Welcome from '@/views/Welcome';
import GetHelp from '@/views/GetHelp';
import FAQ from '@/views/FAQ';

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

const PREFIX = 'BusinessOwner';

const classes = {
  parent: `${PREFIX}-parent`,
  contentWrapper: `${PREFIX}-contentWrapper`
};

const Root = styled('div')({
  [`&.${classes.parent}`]: {
    width: '100%',
    padding: '2rem 2rem 4rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  [`& .${classes.contentWrapper}`]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '1140px',
  }
});

const BusinessOwner = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.getElementById('root');
    el.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Root className={classes.parent}>
      <div className={classes.contentWrapper}>
        <Routes>
          <Route path='/business/:step/*' element={<MyBusinessNav />} />
          <Route path='/myDashboard' element={<MyBusiness />} />
          <Route path='/submission/:submissionId' element={<MyBusinessSubmission />} />
          <Route path='/noi' element={<NoiOverview />} />
          <Route path='/noi/success' element={<NoiOverview />} />
          <Route path='/noi/submit' element={<NoiSubmit />} />
          <Route path='/products/*' element={<ProductRoutes />} />
          <Route path='/manufacturing' element={<ManufacturingOverview />} />
          <Route path='/manufacturing/submit' element={<ManufacturingSubmit />} />
          <Route path='/manufacturing/:reportId' element={<ManufacturingReport />} />
          <Route path='/sales/*' element={<SalesRoutes />} />
          <Route path='/view-location/:reportId' element={<Location />} />
          <Route path='/gethelp' element={<GetHelp />} />
          <Route path='/FAQ' element={<FAQ />} />
          <Route path='/*' element={<Welcome />} />
        </Routes>
      </div>
    </Root>
  );
};
export default BusinessOwner;
