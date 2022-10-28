import { Box, IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import LeftPanel from './LeftPanel';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import useLeaflet from '@/hooks/useLeaflet';
import Leaflet from '@/components/generic/Leaflet';
import { LocationConfig } from '@/constants/localInterfaces';

const useStyles = makeStyles((theme) => ({
  menu_leftPanelDrawer: {
    flex: '0.42 0 auto',
    '& .MuiDrawer-paper': {
      '& .MuiBox-root': {
        paddingTop: 0
      }
    }
  },
  menu_MapWrap: {
    marginTop: '0 !important',
    '& .MuiDrawer-paper': {
      top: 140
    }
  }
}));

interface MapProps {
  config: LocationConfig;
  asMenu?: Boolean
}

function Map({asMenu, config}: MapProps) {
  const classes = useStyles();
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
    setShowHALayer,
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
      style= {{ marginTop: '70px' }}
      className={asMenu && classes.menu_MapWrap}
    >
      <Drawer open={open} variant="persistent" className={asMenu && classes.menu_leftPanelDrawer}>
        <Box minHeight="calc(100vh - 70px)" pt={8} >
          <LeftPanel
            mapInMenu={asMenu}
            locations={selectedLocations}
            setLocations={setSelectedLocations}
            startingLocation={startingLocation}
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
            setShowHALayer={setShowHALayer}
          />
        </Box>
      </Drawer>

      {open && !asMenu && <Box flex={0.35} />}
      <Box
        flex={open ? (asMenu ? 0.77: 0.65) : 1}
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
