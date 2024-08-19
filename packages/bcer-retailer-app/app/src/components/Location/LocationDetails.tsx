import { BusinessLocation } from '@/constants/localInterfaces';
import { styled } from '@mui/material/styles';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { useAxiosGet } from '@/hooks/axios';
import { formatError } from '@/utils/formatting';
import { Box, makeStyles, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { LocationType } from 'vaping-regulation-shared-components';
import LocationDetailsSkeleton from '../generic/skeletons/LocationDetailsSkeleton';

const PREFIX = 'LocationDetails';

const classes = {
  box: `${PREFIX}-box`,
  boxTitle: `${PREFIX}-boxTitle`,
  boxRow: `${PREFIX}-boxRow`,
  rowTitle: `${PREFIX}-rowTitle`,
  rowContent: `${PREFIX}-rowContent`
};

const StyledBox = styled(Box)({
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    marginBottom: '20px',
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.boxRow}`]: {
    display: 'flex',
    paddingBottom: '20px',
  },
  [`& .${classes.rowTitle}`]: {
    fontSize: '14px',
    color: '#424242',
    width: '300px',
  },
  [`& .${classes.rowContent}`]: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#3A3A3A',
  },
});

export interface LocationDetailsProps {
  id: string;
}

function LocationDetails({ id }: LocationDetailsProps) {

  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const [{ data: location, loading, error }, getLocation] =
    useAxiosGet<BusinessLocation>(`/location/${id}`, { manual: true });
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (error) {
      setAppGlobal({ ...appGlobal, networkErrorMessage: formatError(error) });
    }
  }, [error]);
  return (
    <StyledBox>
      <Paper className={classes.box} variant="outlined">
        {location && (
          <Box>
            <Typography className={classes.boxTitle} variant="subtitle1">
              Retailer Location
            </Typography>
            <Box>
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>
                  {location.location_type === LocationType.online ? "Webpage":"Address"}</Box>
                <Box className={classes.rowContent}>
                  {location.location_type === LocationType.online ? location.webpage: `${location?.addressLine1}, ${location?.postal}, ${location?.city}`}
                </Box>
              </Box>
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>Email address</Box>
                <Box className={classes.rowContent}>{location?.email}</Box>
              </Box>
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>Phone number</Box>
                <Box className={classes.rowContent}>{location?.phone}</Box>
              </Box>
              {location.location_type !== LocationType.online &&
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>
                  Persons under 19 permitted?
                </Box>
                <Box className={classes.rowContent}>{location?.underage}</Box>
              </Box>}
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>Doing business as</Box>
                <Box className={classes.rowContent}>
                  {location?.doingBusinessAs}
                </Box>
              </Box>
              {location.location_type !== LocationType.online &&
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>Region</Box>
                <Box className={classes.rowContent}>
                  {location?.health_authority}
                </Box>
              </Box>}
              <Box className={classes.boxRow}>
                <Box className={classes.rowTitle}>Intent to manufacture</Box>
                <Box className={classes.rowContent}>
                  {location?.manufacturing}
                </Box>
              </Box>
            </Box>{' '}
          </Box>
        )}
        {(loading || error) && <LocationDetailsSkeleton rows={6} />}
      </Paper>
    </StyledBox>
  );
}

export default LocationDetails;
