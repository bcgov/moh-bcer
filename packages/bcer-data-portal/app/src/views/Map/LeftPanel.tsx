import { Avatar, Box, IconButton, InputLabel, Link, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';
import MapIcon from '@material-ui/icons/Map';
import DirectionsIcon from '@material-ui/icons/Directions';
import ArrowRightIcon from '@material-ui/icons/ArrowRightAltOutlined';
import DragSort from '@/components/dragable';
import LocationView from './LocationView';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MapControl from './MapControl';
import Itinerary from './Itinerary';
import LocationAutoComplete from './LocationAutoComplete';
import SearchLocation from './SearchLocation';
import {
  BCDirectionData,
  BCGeocoderAutocompleteData,
  BusinessLocation,
  RouteOptions,
} from '@/constants/localInterfaces';
import { useHistory, useLocation } from 'react-router';
import RouteStatics from './RouteStatics';
import { AxiosError } from 'axios';
import OptimizedOrder from './OptimizedOrder';
import { healthAuthorityOptions } from '@/constants/arrays';
import store from 'store';
import { useAxiosGet } from '@/hooks/axios';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px',
    minWidth: '32vw',
  },
  header: {
    color: '#002C71',
    fontWeight: 'bold',
    fontSize: '27px',
  },
  buttonText: {
    size: '13px',
    color: '#234075',
    fontWeight: 500,
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  healthAuthoritySelectWrap: {
    '& label':{
      color: 'black',
    },
    '& .MuiInputBase-root': {
      width: '50%',
      background: '#f5f5f5',
      height: 40,
      padding: 10,
      marginTop: 5, 
      '& .MuiSelect-select:focus': {
        backgroundColor: 'inherit'
      }   
    }
  },
}));


interface LeftPanelProps {
  mapInMenu: Boolean,
  locations: BusinessLocation[];
  setLocations: React.Dispatch<SetStateAction<BusinessLocation[]>>;
  startingLocation: BCGeocoderAutocompleteData;
  setStartingLocation: React.Dispatch<
    SetStateAction<BCGeocoderAutocompleteData>
  >;
  addLocationToSelectedHandler: (l: BusinessLocation) => void;
  showOnMapHandler: (l: BusinessLocation) => void;
  removeLocationHandler: (l: BusinessLocation) => void;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  initialRoutingOptions: RouteOptions;
  routeData: BCDirectionData;
  createGoogleLink: () => string;
  setRouteOptions: React.Dispatch<SetStateAction<RouteOptions>>;
  setShowHALayer: React.Dispatch<SetStateAction<boolean>>,
  directionError: AxiosError;
  healthAuthorityLocations: BusinessLocation[],
  setHealthAuthorityLocations: React.Dispatch<SetStateAction<BusinessLocation[]>>,
  clickedLocation: BusinessLocation,
  setDisplayItinerary: React.Dispatch<SetStateAction<boolean>>
}

function LeftPanel({
  mapInMenu,
  locations,
  setLocations,
  startingLocation,
  setStartingLocation,
  addLocationToSelectedHandler,
  showOnMapHandler,
  removeLocationHandler,
  setDrawerOpen,
  initialRoutingOptions,
  routeData,
  createGoogleLink,
  setRouteOptions,
  setShowHALayer,
  directionError,
  setHealthAuthorityLocations,
  clickedLocation,
  setDisplayItinerary
}: LeftPanelProps) {
  const classes = useStyles();
  const history = useHistory();  
  const search = useLocation().search;
  const routeHealthAuthority = new URLSearchParams(search).get('authority')
  const [healthAuthority, setHealthAuthority] = useState(routeHealthAuthority || store.get('KEYCLOAK_USER_HA')  || '');
  const [{ data, loading }, getLocationsWithHealthAuthority] =
    useAxiosGet(`data/location?all=true&includes=business,noi&authority=${healthAuthority}`, { manual: true });

  useEffect(() => {   
    if (healthAuthority) {
      getHealthAuthorityLocations();
    }
  }, [])

  useEffect(() => {
    setHealthAuthorityLocations(data?.rows || [])
  }, [data])

  const getHealthAuthorityLocations = async () => {    
    setHAParam();
    await getLocationsWithHealthAuthority();
  }

  const setHAParam = () => {
    const route = history.location.pathname;     
    history.push(`${route}?authority=${healthAuthority}`);
  }

  useEffect(() => {
    if (clickedLocation)      
      setLocations([...locations, clickedLocation])
  }, [clickedLocation])

  return (
    <Box className={classes.container}>      
      {mapInMenu &&  
      <>
        <Typography className={classes.header}>Map of Locations</Typography>
        <Box mt={2} />           
          <div className={classes.healthAuthoritySelectWrap}>
            <InputLabel id="health-authority-label">Health Authority</InputLabel>
            <Select
              labelId="health-authority-label"
              value={healthAuthority}
              onChange={(e: any) => {
                setHealthAuthority(e.target.value)
              }}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Select </em>
              </MenuItem>
              {healthAuthorityOptions.map(ha => {
                return ha.value !== "all" && <MenuItem key={ha.value} value={ha.value}>{ha.label}</MenuItem>
              })}          
            </Select>
            <Avatar 
                onClick={() => getHealthAuthorityLocations()} 
                style={{backgroundColor: "#002C71", display: "inline-flex", top: "8px", marginLeft: 5, width: 35, height: 35, cursor: 'pointer'}}>
              <ArrowRightIcon />
            </Avatar>
          </div>

          <Box mt={4} mb={1} borderBottom="1px solid black" />
      </>
      }

      {!mapInMenu &&
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        borderBottom="1px solid black"
        alignItems="center"        
      >        
        <Box>
          <StyledButton
            variant="small-outlined"
            size="small"
            onClick={() => history.goBack()}
          >
            Back
          </StyledButton>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Box>
      }
      <Typography className={classes.header}>Route</Typography>
      <Box mt={1} />
        <StyledButton
          variant="small-outlined"
          size="small"
          onClick={() => window.open(createGoogleLink(), '_blank')}
        >
          <MapIcon fontSize="small" />
          <Box ml={1} />
          Show in Google Map
        </StyledButton>

        {locations.length > 0 &&
        <StyledButton
          variant="small-outlined"
          size="small"
          style={{float: 'right'}}
          onClick={() => setDisplayItinerary(true)}
        >
          <DirectionsIcon fontSize="small" />
          <Box ml={1} />
          Display Itinerary
        </StyledButton>}
      <Box mt={4} />
      
      <Box mt={2} mb={1}>
        <Typography className={classes.label}>Starting Address</Typography>
      </Box>
      <SearchLocation setSelect={setStartingLocation} />
      <Box mt={2} mb={1}>
        <Typography className={classes.label}>Retail Locations</Typography>
      </Box>      
      <DragSort
        setState={setLocations}
        state={locations}
        Component={LocationView}
        componentProps={{ showOnMapHandler, removeLocationHandler }}
      />
      <Box my={2}>
        <LocationAutoComplete
          selectedLocations={locations}
          addLocationToSelectedHandler={addLocationToSelectedHandler}
        />
      </Box>
      <RouteStatics directionData={routeData} directionError={directionError} />
      <Box mt={2} />
      <MapControl
        initialRoutingOptions={initialRoutingOptions}
        setRouteOptions={setRouteOptions}
        setShowHALayer={setShowHALayer}
      />
      {routeData?.visitOrder && locations && (
        <OptimizedOrder
          routeData={routeData}
          selectedLocations={locations}
          startingLocation={startingLocation}
        />
      )}
      {routeData && <Itinerary directionData={routeData} />}
    </Box>
  );
}

export default LeftPanel;
