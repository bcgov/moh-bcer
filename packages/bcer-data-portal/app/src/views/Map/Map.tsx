import { Box, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import LeftPanel from './LeftPanel';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import useLeaflet from '@/hooks/useLeaflet';
import Leaflet from '@/components/generic/Leaflet';
import { LocationConfig } from '@/constants/localInterfaces';

interface MapProps {
  config: LocationConfig;
}

function Map({config}: MapProps) {
  const search = useLocation().search;
  const history = useHistory();
  const locationIds = new URLSearchParams(search).get('locations');
  const [open, setOpen] = useState<boolean>(true);

  const {
    selectedLocations,
    setSelectedLocations,
    startingLocation,
    setStartingLocation,
    addLocationToSelectedHandler,
    removeSelectedLocationHandler,
    onRender,
    resetMapSize,
    initialRoutingOptions,
    routeData,
    showOnMapHandler,
    createGoogleLink,
    setRouteOptions,
    directionError,
  } = useLeaflet(locationIds, config);

  useEffect(() => {
    resetMapSize();
  }, [open]);

  return (
    <Box
      display="flex"
      width="100%"
      position="relative"
      style={{ marginTop: '70px' }}
    >
      <Drawer open={open} variant="persistent">
        <Box minHeight="calc(100vh - 70px)" pt={8}>
          <LeftPanel
            locations={selectedLocations}
            setLocations={setSelectedLocations}
            setStartingLocation={setStartingLocation}
            addLocationToSelectedHandler={addLocationToSelectedHandler}
            showOnMapHandler={showOnMapHandler}
            removeLocationHandler={removeSelectedLocationHandler}
            setDrawerOpen={setOpen}
            initialRoutingOptions={initialRoutingOptions}
            routeData={routeData}
            createGoogleLink={createGoogleLink}
            setRouteOptions={setRouteOptions}
            directionError={directionError}
          />
        </Box>
      </Drawer>

      {open && <Box flex={0.35} />}
      <Box
        flex={open ? 0.65 : 1}
        minHeight={open ? 'calc(100vh - 70px)' : 'calc(100vh - 115px)'}
      >
        {!open && (
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
        <Leaflet onRender={onRender} />
      </Box>
    </Box>
  );
}

export default Map;
