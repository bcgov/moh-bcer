import { Avatar, Box, CircularProgress, IconButton, InputLabel, MenuItem, Select, Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import React, { SetStateAction, useEffect, useState } from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAltOutlined';
import DragSort from '@/components/dragable';
import LocationView from './LocationView';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
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
import { useNavigate, useLocation } from 'react-router-dom';
import RouteStatics from './RouteStatics';
import { AxiosError } from 'axios';
import OptimizedOrder from './OptimizedOrder';
import { healthAuthorityOptions } from '@/constants/arrays';
import store from 'store';
import { useAxiosGet } from '@/hooks/axios';
import Leaflet from '@/components/generic/Leaflet';

const PREFIX = 'LeftPanel';

const classes = {
  container: `${PREFIX}-container`,
  header: `${PREFIX}-header`,
  buttonText: `${PREFIX}-buttonText`,
  label: `${PREFIX}-label`,
  healthAuthoritySelectWrap: `${PREFIX}-healthAuthoritySelectWrap`,
  mapWrap: `${PREFIX}-mapWrap`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`&.${classes.container}`]: {
    padding: '20px',
    minWidth: '32vw',
    [theme.breakpoints.down('xs')]: {

    }
  },

  [`& .${classes.header}`]: {
    color: '#002C71',
    fontWeight: 'bold',
    fontSize: '27px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    }
  },

  [`& .${classes.buttonText}`]: {
    size: '13px',
    color: '#234075',
    fontWeight: 500,
  },

  [`& .${classes.label}`]: {
    fontSize: '16px',
    fontWeight: 'bold',
  },

  [`& .${classes.healthAuthoritySelectWrap}`]: {
    '& label':{
      color: 'black',
    },
    '& .MuiInputBase-root': {
      width: '100%',
      background: '#f5f5f5',
      height: 40,
      padding: 10,
      marginTop: 5, 
      '& .MuiSelect-select:focus': {
        backgroundColor: 'inherit'
      }   
    }
  },

  [`& .${classes.mapWrap}`]: {
    height: 330,
    marginTop: 20,
    border: "1px solid #CDCED2",
    borderRadius: 4
  }
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
  setDisplayItinerary: React.Dispatch<SetStateAction<boolean>>,
  onRender: () => void,
  downloadItinerary: () => void,
  downloadingItinerary: Boolean
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
  setDisplayItinerary,
  onRender,
  downloadItinerary,
  downloadingItinerary
}: LeftPanelProps) {

  const navigate = useNavigate();
  const location = useLocation();
  const search = useLocation().search;
  const routeHealthAuthority = new URLSearchParams(search).get('authority')
  const [healthAuthority, setHealthAuthority] = useState(routeHealthAuthority || store.get('KEYCLOAK_USER_HA')  || '');
  const [{ data, loading }, getLocationsWithHealthAuthority] =
    useAxiosGet(`data/location?all=true&includes=business,noi&authority=${healthAuthority}`, { manual: true });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
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
    const route = location.pathname;     
    navigate(`${route}?authority=${healthAuthority}`);
  }

  useEffect(() => {
    if (clickedLocation)      
      setLocations([...locations, clickedLocation])
  }, [clickedLocation])

  return (
    <StyledBox className={classes.container}>      
      {mapInMenu &&  
      <>
        <Typography className={classes.header}>Map of Locations</Typography>
        <Box mt={2} />         

        <Grid container spacing={2} className={classes.healthAuthoritySelectWrap}>
          <Grid item xs={10} md={6}>
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
          </Grid>
          <Grid item xs={2} md={2}>
            <Grid>&nbsp;</Grid>
            <Avatar 
                onClick={() => getHealthAuthorityLocations()} 
                style={{backgroundColor: "#002C71", cursor: 'pointer'}}>              
              {loading ? <CircularProgress  size={24} style={{color: 'white'}}/> : <ArrowRightIcon />}
            </Avatar>
          </Grid>
        </Grid>
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
            onClick={() => navigate(-1)}
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
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <StyledButton
            variant="small-outlined"
            size="small"
            onClick={() => window.open(createGoogleLink(), '_blank')}>
            <MapIcon fontSize="small" />
            <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 1 }} />
            Show in Google Map
          </StyledButton>
        </Grid>
        <Grid item xs={4}>
          {locations.length > 0 &&
            <StyledButton
              variant="small-outlined"
              size="small"
              style={{float: 'right'}}
              onClick={() => setDisplayItinerary(true)}>
              <DirectionsIcon fontSize="small" />
              <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 1 }} />
              Display Itinerary
            </StyledButton>}
        </Grid>
        <Grid item xs={4}>
        {locations.length > 0 && routeData &&
            <StyledButton
              variant="small-contained"
              size="small"
              style={{float: 'right', padding: "4px 6px"}}
              onClick={() => downloadItinerary()}
              >
              {downloadingItinerary ? 
                <CircularProgress size={24} /> : 
                <>
                  <DirectionsIcon fontSize="small" /> Export Itinerary to PDF
                </>
              }
               
            </StyledButton>}
        </Grid>
      </Grid>
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
      {isMobile && (
        <div className={classes.mapWrap}>          
          <Leaflet onRender={onRender} />
        </div>
      )}
      {routeData && <Itinerary directionData={routeData} />}
      {isMobile && (
        <>
          <Box mt={15} />
          Not to be seen
        </>
      )}
    </StyledBox>
  );
}

export default LeftPanel;
