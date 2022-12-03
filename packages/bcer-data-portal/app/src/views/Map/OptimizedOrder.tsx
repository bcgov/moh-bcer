import StyledToolTip from '@/components/generic/StyledToolTip';
import {
  BCDirectionData,
  BCGeocoderAutocompleteData,
  BusinessLocation,
} from '@/constants/localInterfaces';
import { Box, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#E0E8F0',
    padding: '5px 15px',
    borderRadius: '4px',
    border: '1px solid #2E2E4E',
  },
  text: {
    fontSize: '16px',
    maxWidth: '400px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
}));

interface OptimizedOrderProps {
  routeData: BCDirectionData;
  selectedLocations: BusinessLocation[];
  startingLocation: BCGeocoderAutocompleteData;
}

function OptimizedOrder({
  routeData,
  selectedLocations,
  startingLocation,
}: OptimizedOrderProps) {
  const classes = useStyles();
  const [optimized, setOptimized] = useState<BusinessLocation[]>();
  useEffect(() => {
    if (!routeData?.visitOrder) return;

    let idxNormalizer = startingLocation ? 1 : 0;
    let temp =
      selectedLocations?.filter((l) => l.latitude && l.longitude) ?? [];

    let optimizedTemp: BusinessLocation[] = [];

    routeData.visitOrder.forEach((v) => {
      const normalizedIndex = v - idxNormalizer;
      if (normalizedIndex < 0) return;
      optimizedTemp.push(temp[normalizedIndex]);
    });
    setOptimized(optimizedTemp);
  }, [routeData]);
  return (
    <Box mt={2}>
      <Box my={1}>
        <Typography className={classes.label}>Visit Order</Typography>
      </Box>
      {startingLocation && (
        <Box my={1} className={classes.container}>
          <StyledToolTip title="Starting Location">
            <Typography className={classes.text}>
              {startingLocation.properties?.fullAddress}
            </Typography>
          </StyledToolTip>
        </Box>
      )}
      {optimized?.map(
        (l) =>
          l && (
            <Box my={1} className={classes.container} key={l.id}>
              <StyledToolTip
                title={l?.business?.businessName || l?.business?.legalName}
              >
                <Typography className={classes.text}>
                  {l?.geoAddress ||
                    `${l.addressLine1}, ${
                      l.addressLine2 ? `${l.addressLine2},` : ''
                    } ${l.city}, ${l.postal}`}
                </Typography>
              </StyledToolTip>
            </Box>
          )
      )}
    </Box>
  );
}

export default OptimizedOrder;
