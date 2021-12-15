import GoogleMap from '@/components/GoogleMap';
import useMap from '@/hooks/useMap';
import { Box } from '@material-ui/core';
import React from 'react';
import { useLocation } from 'react-router';

function Map() {
  const search = useLocation().search;
  const locationIds = new URLSearchParams(search).get('locations');
  const { onGoogleApiLoaded } = useMap(locationIds);
  return (
    <Box display="flex" width='100%'>
      <Box flex={0.25} height='calc(100vh - 70px)'>
        Hello There
      </Box>
      <Box flex={0.75} height='calc(100vh - 70px)'>
        <GoogleMap onGoogleApiLoaded={onGoogleApiLoaded} />
      </Box>
    </Box>
  );
}

export default Map;
