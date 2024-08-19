import React, { useEffect, useState } from 'react';
import { Box, IconButton, styled, useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import LeftPanel from './LeftPanel';
import useLeaflet from '@/hooks/useLeaflet';
import Leaflet from '@/components/generic/Leaflet';
import { LocationConfig } from '@/constants/localInterfaces';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  position: 'relative',
  marginTop: '70px',
  '&.menu_MapWrap': {
    marginTop: '0 !important',
    '& .MuiDrawer-paper': {
      top: 140
    }
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '&.menu_leftPanelDrawer': {
    flex: '0.42 0 auto',
    '& .MuiDrawer-paper': {
      '& .MuiBox-root': {
        paddingTop: 0
      }
    }
  }
}));

interface MapProps {
  config: LocationConfig;
  asMenu?: boolean;
}

function Map({asMenu, config}: MapProps) {
  const search = useLocation().search;
  const locationIds = new URLSearchParams(search).get('locations');
  const [open, setOpen] = useState<boolean>(true);
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

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
    healthAuthorityLocations,
    setHealthAuthorityLocations,
    clickedLocation,
    setDisplayItinerary,
    downloadItinerary,
    downloadingItinerary
  } = useLeaflet(locationIds, config);

  useEffect(() => {
    resetMapSize();
  }, [open]);

  return (
    <StyledBox id= 'mapComponent' className={asMenu ? 'menu_MapWrap' : ''}>
      <StyledDrawer
        open={open}
        variant="persistent"
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        className={asMenu ? 'menu_leftPanelDrawer' : ''}
      >
        <Box minHeight="calc(100vh - 70px)" pt={8}>
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
            healthAuthorityLocations={healthAuthorityLocations}
            setHealthAuthorityLocations={setHealthAuthorityLocations}
            clickedLocation={clickedLocation}
            setDisplayItinerary={setDisplayItinerary}
            onRender={onRender}
            downloadItinerary={downloadItinerary}
            downloadingItinerary={downloadingItinerary}
          />
        </Box>      
      </StyledDrawer>

      {open && !asMenu && <Box flex={0.35} />}
      <Box
        flex={open ? (asMenu ? 0.77: 0.65) : 1}
        minHeight={asMenu ? 'calc(100vh - 139px)' :open ? 'calc(100vh - 70px)' : 'calc(100vh - 115px)'}
      >
        {!open && (
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
        {isSmUp && <Leaflet onRender={onRender} />}
      </Box>
    </StyledBox>
  );
}

export default Map;