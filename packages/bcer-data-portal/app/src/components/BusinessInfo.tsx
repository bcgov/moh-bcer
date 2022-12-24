import { BusinessRO } from '@/constants/localInterfaces';
import { BusinessStatus } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useContext, useEffect, useState } from 'react';
import { ProvinceLabels, StyledButton, StyledConfirmDateDialog } from 'vaping-regulation-shared-components';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { LocationUtil } from '@/util/location.util';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  box: {
    display: 'flex',
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
    justifyContent: 'space-between',
  },
  cellTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0053A4',
    paddingBottom: '12px',
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
  },
}));

function BusinessInfo({ businessId }: { businessId: string }) {
  const classes = useStyles();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [isConfirmCloseDialogOpen, setIsConfirmCloseDialogOpen] = useState<Boolean>(false);

  const [{ data, error }, get] = useAxiosGet<BusinessRO>(
    '/data/business/' + businessId
  );

  const [{ response: closeResponse, loading: closeLoading, error: closeError }, closePatch] = useAxiosPatch(`/data/business/close/`, { manual: true });

  const closeBusiness = async ({ date }: { date: Date }) => {
    await closePatch({
      url: `/data/business/close/${businessId}?closedTime=${moment(date).unix()}`,
    });    
  };

  useEffect(() => {
    if (error || closeError) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error || closeError),
      });
    }
  }, [error, closeError]);

  useEffect(() => {
    if(closeResponse) {
      setIsConfirmCloseDialogOpen(false)
      get()
    }
  }, [closeResponse])

  return (
    <Box>
      {data && (
        <Grid item xs={12} id="locationInformation">
          <Box display={'flex'}>
            <Typography className={classes.cellTitle}>Business Information</Typography>
            {data.status === BusinessStatus.Active &&
            <Box ml={3} style={{marginLeft: 'auto'}}>
              <StyledButton variant="contained" onClick={() => setIsConfirmCloseDialogOpen(true)} style={{minWidth: 150, backgroundColor: '#FF534A', fontWeight: 600 }}>
                <HighlightOffIcon />&nbsp;&nbsp; Deactivate  
              </StyledButton>
            </Box>}
          </Box>
          
          <Box pb={1}/>
            <Paper className={classes.box}>
            <Grid container spacing={2}>
            <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Business Status</Typography>
                  <Typography className={classes.rowContent}>
                    {data.status}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Business legal name</Typography>
                  <Typography className={classes.rowContent}>
                    {data.legalName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">
                    Name under which business is conducted
                  </Typography>
                  <Typography className={classes.rowContent}>
                    {data.businessName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Address line 1</Typography>
                  <Typography className={classes.rowContent}>
                    {data.addressLine1}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Address line 2</Typography>
                  <Typography className={classes.rowContent}>
                    {data.addressLine2 || ''}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">City</Typography>
                  <Typography className={classes.rowContent}>
                    {data.city}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Province</Typography>
                  <Typography className={classes.rowContent}>
                    {ProvinceLabels[data.province as keyof typeof ProvinceLabels]}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Postal code</Typography>
                  <Typography className={classes.rowContent}>
                    {data.postal}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Phone number</Typography>
                  <Typography className={classes.rowContent}>
                    {data.phone}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Email</Typography>
                  <Typography className={classes.rowContent}>
                    {data.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Web page</Typography>
                  <Typography className={classes.rowContent}>
                    {data.webpage}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            </Paper>
        </Grid>
      )}
      {
        isConfirmCloseDialogOpen
          &&
          <StyledConfirmDateDialog
            open={isConfirmCloseDialogOpen}
            confirmHandler={closeBusiness}
            dialogTitle="Confirm Your Closing Business"
            setOpen={() => setIsConfirmCloseDialogOpen(false)}
            dialogMessage="You are about to close this business. You may provide the date the business was Closed."
            checkboxLabel="I confirm that I wish to close this business. I understand that this is only possible after closing all its locations or transferring locations to another active business."
            maxDate={LocationUtil.getLocationCloseWindow().max}
            minDate={LocationUtil.getLocationCloseWindow().min}
            acceptDisabled = {closeLoading}
          />                
      }
    </Box>
  );
}

export default BusinessInfo;
