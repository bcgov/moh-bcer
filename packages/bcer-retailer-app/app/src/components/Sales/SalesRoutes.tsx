import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import store from 'store';

import { SalesReportProvider } from '@/contexts/SalesReport';
import SalesOverview from '@/views/Sales/Overview';
import SelectSalesLocation from '@/views/Sales/SelectLocation';
import SubmitSalesReport from '@/views/Sales/SubmitSales';
import SuccessSalesReport from '@/views/Sales/Success';
import CommingSoon from '@/views/CommingSoon';
import SaleUpload from '@/views/Sales/SaleUpload';
import { SubmissionTypeEnum } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import SaleReview from '@/views/Sales/SaleReview';



export default function SalesRoutes(){
  const [{ loading, error, response, data: submission }, get] = useAxiosGet('/submission', { manual: true });
  const [{ loading: postLoading, error: postError, data: newSubmission }, post] = useAxiosPost('/submission', { manual: true });
  const [appGlobal, setAppGlobalContext ] = useContext(AppGlobalContext);
  const [sales, setSales] = useState({
    submissionId: '',
    saleReports: [],
    mapping: {
      brandName:'',
      productName:'',
      concentration:'',
      containerCapacity:'',
      cartridgeCapacity:'',
      flavour:'',
      upc: '',
      containers:'',
      cartridges:'',
    },
    locationId: '',
    year: '',
    address: '',
    doingBusinessAs: '',
    fileData: undefined,
    isConfirmOpen: false,
    isSubmitted: false,
  });

  useEffect(() => {
    (async () => {
      const submissionId = store.get('salesReportSubmissionId') || sales.submissionId;
      // GET: returns an existing submission
      // TODO: when we have a keycloak token, this GET should also return existing business and location data for the business entity
      // POST: creates a new submission
      (await submissionId) 
        ? get({ url: `/submission/${submissionId}` }) 
        : post({
            data: {
              // NB: legal name of business is hard coded
              // when we have business name from BCeID, we will useKeycloak() to get this data OR read it from the token
              legalName: 'Happy Puff',
              type: SubmissionTypeEnum.sales,
              ...sales
            }
          });
    })();
  }, [sales.submissionId]);

  useEffect(() => {
    if (submission && !error) {
      store.set('salesReportSubmissionId', submission.id)
      setSales({
        ...sales,
        ...submission.data,
        submissionId: submission.id,
      })
    }
  }, [submission, error]);

  useEffect(() => {
    if (error) {
      setAppGlobalContext({...appGlobal, networkErrorMessage: formatError(error)});
    }
  }, [error]);

  useEffect(() => {
    if (newSubmission && !postError) {
      store.set('salesReportSubmissionId', newSubmission.id)
      setSales({
        ...sales,
        ...newSubmission.data,
        submissionId: newSubmission.id,
      })
    }
  }, [newSubmission]);

  useEffect(() => {
    if (postError) {
      setAppGlobalContext({...appGlobal, networkErrorMessage: formatError(postError)});
    }
  }, [postError]);


  return(
    <>
      <SalesReportProvider value={[sales, setSales]}>
          <Routes>
            <Route path='/sales' element={<SalesOverview />} />
            <Route path='/sales/upload' element={<SaleUpload />} />
            <Route path='/sales/review' element={<SaleReview />} />
            <Route path='/sales/submit' element={<SubmitSalesReport />} />
            <Route path='/sales/success' element={<SuccessSalesReport />} />
          </Routes>
      </SalesReportProvider>
    </>
  )
}