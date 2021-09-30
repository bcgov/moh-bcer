import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { makeStyles, Typography, Paper, Snackbar } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { StyledTable, StyledButton, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { ProductInfoContext } from '@/contexts/ProductReport';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  boxTitle: {
    paddingBottom: '10px'
  },
  tableRowCount: {
    paddingBottom: '10px'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  csvLink: {
    textDecoration: 'none',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  checkboxLabel: {
    marginTop: '20px'
  },
});

export default function SelectLocations() {
  const classes = useStyles();
  const history = useHistory();

  const [{ data: locations = [], loading, error }, get] = useAxiosGet(`/location`); 
  const [{ response, loading: patchLoading, error: patchError }, patch] = useAxiosPatch(`/products`, { manual: true });
  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productInfo, setProductInfo] = useContext(ProductInfoContext);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const confirmSubmit = async() => {
    await patch({
      data: {
        locationIds: productInfo.locations,
        products: productInfo.products,
      }
    })
  }

  useEffect(() => {
    setProductInfo({
      ...productInfo,
      locations: [],
    });
  }, []);

  useEffect(() => {
    if (patchError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(patchError)})
    }
  }, [patchError])

  useEffect(() => {
    if (response && !error) {
      history.push('/products/success')
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error]);

  return (
    <>
      <div>
        <StyledButton onClick={() => history.push('/products/add-reports')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Cancel
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Select Locations
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
            Select the location that this product list applies to, you can select multiple
            locations if they will sell the same inventory.
          </Typography>
        </div>
        <Paper className={classes.box} variant='outlined'>
          <Typography className={classes.boxTitle} variant='subtitle1'>Select locations that this report applies to.</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>
              You have {locations.length} retail locations.
              {productInfo.products.length * productInfo.locations.length < 200000
                ? ` You are submitting ${productInfo.products.length} products to ${productInfo.locations.length} locations.`
                : ` Please limit your submission to ${Math.floor(200000 / productInfo.products.length)} locations.`
              }
            </Typography>
            {
              locations.length
              ?
                <CSVLink
                  headers={Object.keys(BusinessLocationHeaders)}
                  data={locations?.map((l: BusinessLocation) => {
                    return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                  })}
                  filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              : null
            }
          </div>
          <div style={{ overflowX: 'auto' }}>
            <StyledTable
              columns={[
                {title: 'Address', render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`},
                {title: 'Email Address', field: 'email'},
                {title: 'Phone Number', field: 'phone'},
              ]}
              data={locations}
              options={{ selection: true }}
              onSelectionChange={(rows: any) => {
                setSelectedProducts(rows.map((row: BusinessLocation) => row.id))
                setProductInfo({
                  ...productInfo,
                  locations: rows.map((row: BusinessLocation) => row.id)
                })
              }}
            />
          </div>
        </Paper>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant='contained'
            onClick={() => setOpenConfirm(true)}
            disabled={!selectedProducts.length || productInfo.products.length * productInfo.locations.length > 200000}
          >
            Submit
          </StyledButton>
        </div>
      </div>
      <Snackbar
        open={patchLoading}
        message={'Submitting product report. Please wait...'}
        ClickAwayListenerProps={{mouseEvent: false, touchEvent: false}}
      />
      <StyledConfirmDialog
        open={isConfirmOpen}
        maxWidth='sm'
        dialogTitle="Confirm Your Submission and Acknowledge"
        checkboxLabel='I understand that I will be required to wait 6 weeks from the time that I file or update my product report before I can sell these products. I acknowledge that submission of my product reports does not indicate Ministry approval of the submitted products and that I am still subject to enforcement actions from Health Authorities, should my products be in non-compliance with the E-Substances Regulation.'
        dialogMessage='You are about to submit your product report.'
        setOpen={() => setOpenConfirm(false)}
        confirmHandler={confirmSubmit}
        acceptDisabled={patchLoading}
        cancelDisabled={patchLoading}
      />
    </>
  );
}
