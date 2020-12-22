import React, { useEffect, useState, useContext } from 'react'
import { StyledButton, StyledTable, StyledTextField } from 'vaping-regulation-shared-components';
import { makeStyles, Paper, Typography, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { AppGlobalContext } from '@/contexts/AppGlobal';
import { SalesReportContext } from '@/contexts/SalesReport';
import { useAxiosPatch, useAxiosGet } from '@/hooks/axios';

const useStyles = makeStyles({
  bannerWrapper: {
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  box: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
})

export default function SubmitSalesReport() {
  const history = useHistory();
  const classes = useStyles();

  const [salesReport, setSalesReport] = useContext(SalesReportContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [products, setProducts] = useState([]);
  const [{ data: locationData, loading: productsLoading, error }, get] = useAxiosGet(`/location/${salesReport.locationId}?includes=sales,sales.product,products`, { manual: true });
  const [, patch] = useAxiosPatch(`/sales`, { manual: true });
  const [displayEmpty, setDisplayEmpty] = useState(false);

  useEffect(() => {
    if (!salesReport.year || !salesReport.locationId
      || salesReport.year.length === 0 || salesReport.locationId.length === 0) {
      setSalesReport({
        year: '',
        locationId: '',
        address: '',
      });
      history.push('/sales/select');
    }
  });

  useEffect(() => {
    if (
      !productsLoading && !locationData) {
      get();
    }
  });

  useEffect(() => {
    if (locationData) {
      const salesDictionary = locationData.sales.reduce((salesDict: any, sale: any) => {
        if (sale.year === salesReport.year) {
          salesDict[sale.product.id] = sale;
        }
        return salesDict;
      }, {});
      const productsWithSales = locationData.products.map((product: any) => {
        return {
          id: product.id,
          brand: product.brandName,
          productName: product.productName,
          type: product.type,
          flavour: product.flavour,
          volume: product.concentration,
          saleId: salesDictionary[product.id]?.id || undefined,
          containers: salesDictionary[product.id]?.containers || undefined,
          cartridges: salesDictionary[product.id]?.cartridges || undefined,
        }
      });
      if (productsWithSales.length === 0) {
        setDisplayEmpty(true);
      }
      setProducts(productsWithSales);
    }
  }, [locationData]);

  const submitSales = async () => {
    if (products.some(product => !product.containers || !product.cartridges)) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: 'Please ensure you submit container and cartridge sales for all of your products.',
      });
      return;
    }
    const sales = products.map(product => {
      if (product.containers && product.cartridges) {
        return {
          productId: product.id,
          locationId: salesReport.locationId,
          id: product.saleId,
          containers: product.containers,
          cartridges: product.cartridges,
          year: salesReport.year,
        };
      }
    }).filter(sale => sale);
    await patch({
      data: {
        sales,
      }
    });
    history.push('/sales/success');
  }

  return (
    <>
      <div>
        <StyledButton onClick={() => history.goBack()}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Back
        </StyledButton>
        <Typography className={classes.title} variant='h5'>Add Sales Details</Typography>
        <Typography variant='body1'>
          We have brought in a product based on your previously submitted product report for this location. If you have sold a product that was not previously submitted, please submit an updated product report for this location here.
        </Typography>
        <Typography variant='h5'>
          {salesReport.address}
        </Typography>
        {
          products.length > 0 ?
          <>
            <StyledTable
              columns={[
                { title: 'Brand', field: 'brand', editable: 'never' },
                { title: 'Product Name', field: 'productName', editable: 'never' },
                { title: 'Type', field: 'type', editable: 'never' },
                { title: 'Flavour', field: 'flavour', editable: 'never' },
                { title: 'Volume', field: 'volume', editable: 'never' },
                { title: 'Number of Containers Sold', field: 'containers' },
                { title: 'Number of Cartridges Sold', field: 'cartridges' },
              ]}
              data={products}
              options={{ 
                pageSize: 10,
                pageSizeOptions: [5, 10, 20],
                sorting: true
              }}
              editable={{
                onRowUpdate: (newData: any) =>
                  new Promise((resolve, reject) => {
                    if (!newData.cartridges && !newData.containers) {
                      resolve();
                    }
                    const prods = [...products];
                    const productIndex = prods.findIndex(product => product.id === newData.id);
                    if (!newData.cartridges) newData.cartridges = 0;
                    if (!newData.containers) newData.containers = 0;
                    prods.splice(productIndex, 1, newData);
                    setProducts(prods);
                    resolve();
                  }),
              }}
            />
            <div className={classes.submitWrapper}>
              <StyledButton
                variant='contained'
                onClick={submitSales}
              >
                Submit
              </StyledButton>
            </div>
          </>
          : null
        }
        {
          displayEmpty ?
            <Paper className={classes.bannerWrapper}>
              <Typography variant='body1'>
                You have not submitted any product reports for this location.
              </Typography>
              <Typography variant='body1'>
                Please submit a product report to continue.
              </Typography>
            </Paper>
          : null
        }
      </div>
    </>
  )
}