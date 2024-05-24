import React, { forwardRef, useEffect, useState, useContext } from 'react'
import { styled } from '@mui/material/styles';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { makeStyles, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { AppGlobalContext } from '@/contexts/AppGlobal';
import { SalesReportContext } from '@/contexts/SalesReport';
import { useAxiosPatch, useAxiosGet } from '@/hooks/axios';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';

const PREFIX = 'SubmitSales';

const classes = {
  bannerWrapper: `${PREFIX}-bannerWrapper`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  title: `${PREFIX}-title`,
  box: `${PREFIX}-box`,
  submitWrapper: `${PREFIX}-submitWrapper`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.bannerWrapper}`]: {
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.box}`]: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
  [`& .${classes.submitWrapper}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
});

export default function SubmitSalesReport() {
  const navigate = useNavigate();


  const [salesReport, setSalesReport] = useContext(SalesReportContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [products, setProducts] = useState([]);
  const viewFullscreenTable = useState<boolean>(false);
  const [{ data: locationData, loading: productsLoading, error }, get] = useAxiosGet(`/location/${salesReport.locationId}?includes=sales,sales.product,products`, { manual: true });
  const [, patch] = useAxiosPatch(`/sales`, { manual: true });
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!salesReport.year || !salesReport.locationId
      || salesReport.year.length === 0 || salesReport.locationId.length === 0) {
      setSalesReport({
        year: '',
        locationId: '',
        address: '',
      });
      navigate('/sales/select');
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
          concentration: product.concentration,
          cartridgeCapacity: product.cartridgeCapacity,
          containerCapacity: product.containerCapacity,
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
    navigate('/sales/success');
  }

  return (
    (<Root>
      <div>
        <StyledButton onClick={() => navigate(-1)}>
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
            <FullScreen fullScreenProp={viewFullscreenTable}>
              <TableWrapper
                data={products}
                fullScreenProp={viewFullscreenTable}
                isOutlined={false}
              >
                <StyledTable
                  columns={[
                    { title: 'Brand', field: 'brand', editable: 'never' },
                    { title: 'Product Name', field: 'productName', editable: 'never' },
                    { title: 'Type', field: 'type', editable: 'never' },
                    { title: 'Flavour', field: 'flavour', editable: 'never' },
                    { title: 'Number of Containers Sold', field: 'containers' },
                    { title: 'Number of Cartridges Sold', field: 'cartridges' },
                    { title: 'Concentration', field: 'concentration', editable: 'never' },
                    { title: 'Cartridge Capacity', field: 'cartridgeCapacity', editable: 'never' },
                    { title: 'Container Capacity', field: 'containerCapacity', editable: 'never' },
                  ]}
                  data={products}
                  options={{ 
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 20],
                    sorting: true
                  }}
                  localization={{
                    body: {
                      bulkEditTooltip: 'The data will not be saved until you submit your changes',
                      bulkEditApprove: 'The data will not be saved until you submit your changes',
                    }
                  }}
                  icons={{
                    Check: forwardRef((props, ref) => (
                      <StyledButton variant='contained' onClick={(event: any) => setEditing(false)} >
                        Done Editing
                      </StyledButton>
                    )),
                    Clear: forwardRef((props, ref) => (
                      <StyledButton variant='outlined' onClick={(event: any) => setEditing(false)} >
                        Cancel
                      </StyledButton>
                    )),
                    Edit: forwardRef((props, ref) => (
                      <StyledButton variant='outlined' onClick={(event: any) => setEditing(true)} >
                        Edit All
                      </StyledButton>
                    )),
                  }}
                  editable={{
                    onBulkUpdate: (changes: { [key: number]: any }) =>
                      new Promise((resolve, reject) => {
                        const newProducts = [...products];
                        Object.keys(changes).forEach(index => {
                          const idx = parseInt(index, 10);
                          newProducts[idx] = changes[idx].newData;
                        });
                        setProducts(newProducts);
                        setEditing(false);
                        resolve(true);
                      }),
                  }}
                />
              </TableWrapper>
            </FullScreen>
            <div className={classes.submitWrapper}>
              <StyledButton
                variant='contained'
                onClick={submitSales}
                disabled={editing}
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
    </Root>)
  );
}