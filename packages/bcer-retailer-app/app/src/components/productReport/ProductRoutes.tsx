import React, { useState, useEffect, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import store from 'store';

import { ProductInfoProvider } from '@/contexts/ProductReport';
import { SubmissionTypeEnum } from '@/constants/localEnums';
import ProductOverview from '@/views/productReport/Overview'
import AddProductReports from '@/views/productReport/AddProductReports';
import SelectLocations from '@/views/productReport/SelectLocations';
import ConfirmProducts from '@/views/productReport/ConfirmProducts';
import DeleteProductSubmissions from '@/views/productReport/DeleteProductSubmission';
import { AppGlobalContext } from '@/contexts/AppGlobal';


export default function ProductRoutes(){
  const [{ loading, error, response, data: submission }, get] = useAxiosGet('/submission', { manual: true });
  const [{ loading: postLoading, error: postError, data: newSubmission }, post] = useAxiosPost('/submission', { manual: true });
  const [appGlobal, setAppGlobalContext ] = useContext(AppGlobalContext);
  const [productInfo, setProductInfo] = useState({
    submissionId: '',
    locations: [],
    mapping: {
      brandName: '',
      cartridgeCapacity: '',
      concentration: '',
      containerCapacity: '',
      flavour: '',
      ingredients: '',
      manufacturerAddress: '',
      manufacturerEmail: '',
      manufacturerName: '',
      manufacturerContact: '',
      manufacturerPhone: '',
      productName: '',
      type: '',
    },
    products: [],
    entry: ''
  });

  useEffect(() => {
    (async () => {
      const submissionId = store.get('productSubmissionId') || productInfo.submissionId
      // GET: returns an existing submission
      // TODO: when we have a keycloak token, this GET should also return existing business and location data for the business entity
      // POST: creates a new submission
      await submissionId ? get({ url:`/submission/${submissionId}` }) : post({
        data: Object.assign({}, {
          // NB: legal name of business is hard coded
          // when we have business name from BCeID, we will useKeycloak() to get this data OR read it from the token
          legalName: 'Happy Puff',
          type: SubmissionTypeEnum.product
        }, { data: productInfo })
      })
    })()
  }, [])

  useEffect(() => {
    if (submission && !error) {
      store.set('productSubmissionId', submission.id)
      setProductInfo({
        ...productInfo,
        ...submission.data,
        submissionId: submission.id,
      })
    } else {
      if (error) {
        setAppGlobalContext({...appGlobal, networkErrorMessage: error?.response?.data?.message})
      }
    }
  }, [submission, error])

  useEffect(() => {
    if (newSubmission && !postError) {
      store.set('productSubmissionId', newSubmission.id)
      setProductInfo({
        ...productInfo,
        ...newSubmission.data,
        submissionId: newSubmission.id,
      })
    } else {
      if (postError) {
        setAppGlobalContext({...appGlobal, networkErrorMessage: postError?.response?.data?.message})
      }    
    }
  }, [newSubmission, postError])

  return(
    <>
      <ProductInfoProvider value={[productInfo, setProductInfo]} >
        <Switch>
          <Route exact path={['/products', '/products/success']} component={ProductOverview} />
          <Route exact path='/products/add-reports' component={AddProductReports} />
          <Route exact path='/products/confirm-products' component={ConfirmProducts} />
          <Route exact path='/products/select-locations' component={SelectLocations} />
          <Route exact path='/products/submission/:submissionId' component={DeleteProductSubmissions} />
        </Switch>
      </ProductInfoProvider>
    </>
  )
}