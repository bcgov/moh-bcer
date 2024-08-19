import React, { useContext, useEffect, useState } from 'react';
import { BusinessRO } from '@/constants/localInterfaces';
import { BusinessStatus } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ProvinceLabels, StyledButton, StyledConfirmDateDialog } from 'vaping-regulation-shared-components';
import { LocationUtil } from '@/util/location.util';
import moment from 'moment';
import { ConfigContext } from '@/contexts/Config';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
  boxShadow: 'none',
  justifyContent: 'space-between',
}));

const CellTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: '#0053A4',
  paddingBottom: '12px',
}));

const RowContent = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
}));

function BusinessInfo({ businessId }: { businessId: string }) {
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [isConfirmCloseDialogOpen, setIsConfirmCloseDialogOpen] = useState<boolean>(false);
  const { config: authConfig } = useContext(ConfigContext);
  
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
  }, [error, closeError, appGlobal, setAppGlobal]);

  useEffect(() => {
    if(closeResponse) {
      setIsConfirmCloseDialogOpen(false);
      get();
    }
  }, [closeResponse, get]);

  return (
    <Box>
      {data && (
        <Grid item xs={12} id="locationInformation">
          <Box display="flex">
            <CellTitle>Business Information</CellTitle>
            {authConfig.permissions.SEND_TEXT_MESSAGES && data.status === BusinessStatus.Active &&
            <Box ml={3} style={{marginLeft: 'auto'}}>
              <StyledButton variant="contained" onClick={() => setIsConfirmCloseDialogOpen(true)} style={{minWidth: 150, backgroundColor: '#FF534A', fontWeight: 600 }}>
                <HighlightOffIcon />&nbsp;&nbsp; Deactivate  
              </StyledButton>
            </Box>}
          </Box>
          
          <Box pb={1}/>
            <StyledBox component={Paper}>
            <Grid container spacing={2}>
            <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Business Status</Typography>
                  <RowContent>{data.status}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Business legal name</Typography>
                  <RowContent>{data.legalName}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">
                    Name under which business is conducted
                  </Typography>
                  <RowContent>{data.businessName}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Address line 1</Typography>
                  <RowContent>{data.addressLine1}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Address line 2</Typography>
                  <RowContent>{data.addressLine2 || ''}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">City</Typography>
                  <RowContent>{data.city}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Province</Typography>
                  <RowContent>{ProvinceLabels[data.province as keyof typeof ProvinceLabels]}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Postal code</Typography>
                  <RowContent>{data.postal}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={6}>
                <Box>
                  <Typography variant="body2">Phone number</Typography>
                  <RowContent>{data.phone}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Email</Typography>
                  <RowContent>{data.email}</RowContent>
                </Box>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Box>
                  <Typography variant="body2">Web page</Typography>
                  <RowContent>{data.webpage}</RowContent>
                </Box>
              </Grid>
            </Grid>
            </StyledBox>
        </Grid>
      )}
      {isConfirmCloseDialogOpen && (
        <StyledConfirmDateDialog
          open={isConfirmCloseDialogOpen}
          confirmHandler={closeBusiness}
          dialogTitle="Confirm Your Closing Business"
          setOpen={() => setIsConfirmCloseDialogOpen(false)}
          dialogMessage="You are about to close this business. You may provide the date the business was Closed."
          checkboxLabel="I confirm that I wish to close this business. I understand that this is only possible after closing all its locations or transferring locations to another active business."
          maxDate={LocationUtil.getLocationCloseWindow().max}
          minDate={LocationUtil.getLocationCloseWindow().min}
          acceptDisabled={closeLoading}
        />                
      )}
    </Box>
  );
}

export default BusinessInfo;