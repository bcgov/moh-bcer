import { BusinessRO } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/util/formatting';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useContext, useEffect } from 'react';
import { ProvinceLabels } from 'vaping-regulation-shared-components';

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

  const [{ data, error }] = useAxiosGet<BusinessRO>(
    '/data/business/' + businessId
  );

  useEffect(() => {
    if (error) {
      setAppGlobal({
        ...appGlobal,
        networkErrorMessage: formatError(error),
      });
    }
  }, [error]);

  return (
    <Box>
      {data && (
        <Grid item xs={12} id="locationInformation">
          <Typography className={classes.cellTitle}>
            Business Information
          </Typography>
          <Paper className={classes.box}>
            <Grid container spacing={2}>
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
    </Box>
  );
}

export default BusinessInfo;
