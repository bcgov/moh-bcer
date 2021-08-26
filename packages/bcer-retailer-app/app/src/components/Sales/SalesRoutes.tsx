import React, { useState, useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';

import { SalesReportProvider } from '@/contexts/SalesReport';
import SalesOverview from '@/views/Sales/Overview';
import SelectSalesLocation from '@/views/Sales/SelectLocation';
import SubmitSalesReport from '@/views/Sales/SubmitSales';
import SuccessSalesReport from '@/views/Sales/Success';
import CommingSoon from '@/views/CommingSoon';

export default function SalesRoutes(){
  const [{ loading, error, response, data: submission }, get] = useAxiosGet('/submission', { manual: true });
  const [{ loading: postLoading, error: postError, data: newSubmission }, post] = useAxiosPost('/submission', { manual: true });
  const [sales, setSales] = useState({
    locationId: '',
    year: '',
    address: '',
  });

  return(
    <>
      <SalesReportProvider value={[sales, setSales]} >
        <Switch>
          <Route exact path='/sales' component={CommingSoon} />
          <Route exact path='/sales/select' component={SelectSalesLocation} />
          <Route exact path='/sales/submit' component={SubmitSalesReport} />
          <Route exact path='/sales/success' component={SuccessSalesReport} />
        </Switch>
      </SalesReportProvider>
    </>
  )
}