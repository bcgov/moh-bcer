import React, { useContext, useEffect, useState } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import L, { Tooltip } from 'leaflet';
import GeoJSON from 'geojson';
import {
  BCDirectionData,
  BCGeocoderAutocompleteData,
  BusinessLocation,
  LocationConfig,
  RouteOptions,
} from '@/constants/localInterfaces';
import useLocation from './useLocation';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { BcRouteLinkBuilder } from '@/util/bcRouteLink.util';
import { GoogleMapLinkBuilder } from '@/util/googleMapLink.util';
import redMarker from '@/assets/images/marker-icon-2x-red.png';
import markerShadow from '@/assets/images/marker-shadow.png'
import { useAxiosPost } from './axios';
import sanitizeHtml from 'sanitize-html';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useHistory } from 'react-router';

// Map layer for Health Authority Boundaries
const haLayer = createHealthAuthorityLayer();

// Map control for Health Authority Boundary Legend
const haLegend = createHealthAuthorityLegend();

function useLeaflet(locationIds: string, config: LocationConfig) {
  const history = useHistory();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);

  const [routeData, setRouteData] = useState<BCDirectionData>();
  const [directionError, setDirectionError] = useState<any>();

  const [{}, getDirection] = useAxiosPost<BCDirectionData>('/data/location/direction', { manual: true });

  const [healthAuthorityLocations, setHealthAuthorityLocations] = useState<BusinessLocation[]>();
  const {
    selectedLocations,
    setSelectedLocations,
    removeSelectedLocationHandler,
    addLocationToSelectedHandler,
    getLocationIds,
    setRouteParam
  } = useLocation(locationIds);

  const [map, setMap] = useState<L.Map>();
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<L.GeoJSON>();
  const [showHALayer, setShowHALayer] = useState<boolean>(false);  
  const [displayItinerary, setDisplayItinerary] = useState<boolean>(false);    
  const [clickedLocation, setClickedLocation] = useState<BusinessLocation>();
  const [startingLocation, setStartingLocation] =
    useState<BCGeocoderAutocompleteData>();

  // Initial routing options in the map controller
  const initialRoutingOptions: RouteOptions = {
    option: 'fastest',
    roundTrip: false,
    optimizeOrder: false,
    ferrySchedule: false,
    timeDependent: false,
    traffic: false,
    turnRestriction: false,
    events: false,
    crossingCost: false,
    globalDistortionField: false,
    turnCost: false,
    localDistortionField: false,
    haOverlay: false,
  };

  const [routeOptions, setRouteOptions] = useState<RouteOptions>({
    ...initialRoutingOptions,
  });

  /**
   * Once Map is rendered in the dom this method must be called
   * to set up map properties
   */
  const onRender = () => {
    let m = L.map('map').setView([51.4, -116.9], 6);
    // Saving map in state for future use
    setMap(m);
    addTileLayer(m);
  };

  /**
   * Draws markers for all the locations
   */
  const drawAllMarkers = () => {
    const mkrs: L.Marker[] = [];
    mkrs.push(...drawStartingMarker());

    if (selectedLocations?.length && map) {
      selectedLocations.forEach((l) => {
        if (l.latitude && l.longitude) {
          let mkr = L.marker([+l.latitude, +l.longitude]);          
          mkr.bindTooltip(makeMarkerToolTip(l)).openTooltip();
          mkrs.push(mkr);
          mkr.addTo(map);
        }
      });
    }
    setMarkers(mkrs);
    setMapBound(mkrs);
  };

  /**
   * Appropriately zooms the map to show all markers
   * @param {L.Marker} mkrs array of leaflet markers
   */
  const setMapBound = (mkrs: L.Marker[]) => {
    if (map && mkrs?.length) {
      const group = new (L.featureGroup as any)(mkrs);
      map.fitBounds(group.getBounds());
    }
  };

  /**
   * Draws a unique marker for the starting location
   * @returns An array of Leaflet markers or empty array
   */
  const drawStartingMarker = (): L.Marker[] => {
    if (startingLocation?.geometry?.coordinates && map) {
      var startingIcon = new L.Icon({
        iconUrl: redMarker,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41],
      });

      const [lng, lat] = startingLocation.geometry.coordinates;

      const startingMarker = L.marker([lat, lng], { icon: startingIcon });
      startingMarker.bindTooltip(
        `<div style="text-align:center;"><b>Starting Location</b><br/>${safeGuardHtmlString(
          startingLocation.properties.fullAddress
        )}</div>`
      );
      startingMarker.addTo(map);
      return [startingMarker];
    }
    return [];
  };

  /**
   * Makes toolTip content from retail location markers
   * @param {BusinessLocation} l Business location to make marker tooltip 
   * @returns Marker tooltip as html
   */
  const makeMarkerToolTip = (l: BusinessLocation): string => {
    return `<div style="text-align:center;"><b>${safeGuardHtmlString(
      l.business?.businessName ?? l.business?.legalName
    )}</b><br/>${safeGuardHtmlString(l?.geoAddress ?? l.addressLine1)}</div>`;
  };

  /**
   * Tool tip string is injected as html. This function makes sure to safe guard against user input.
   * @param {string} text Unsafe string to be injected as html
   * @returns html-sanitized string
   */
  const safeGuardHtmlString = (text: string) => {
    return sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {}
    })
  };

  /**
   * Removes all the existing marker on map
   */
  const removeAllMarkers = () => {
    if (markers && map) {
      markers.forEach((mkr) => {
        mkr.remove();
        map.removeLayer(mkr);
      });
      setMarkers([]);
    }
  };

  /**
   * Adds Tile style to map
   * @param m Leaflet map where tiles needs to be added
   */
  const addTileLayer = (m: L.Map) => {
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${
        config.mapBoxAccessToken || ''
      }`,
      {
        attribution:
          config.mapBoxAttribution ||
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: config.mapBoxId || 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: config.mapBoxAccessToken || '',
      }
    ).addTo(m);
  };

  /**
   * When user click on a location, map zooms on that location
   * @param {BusinessLocation} l location on which map will zoom in
   */
  const showOnMapHandler = (l: BusinessLocation) => {
    const { latitude, longitude } = l;
    if (map && latitude && longitude) {
      map.setView([+latitude, +longitude], 15);
    }
  };

  /**
   * resets Map if there is any change in map div dimension
   */
  const resetMapSize = () => {
    if (map) {
      map.invalidateSize();
    }
  };

  /**
   * Displays error toast to the user
   * @param {string} message Error message to display 
   */
  const showMapError = (message?: string) => {
    setAppGlobalContext({
      ...appGlobal,
      networkErrorMessage: message || 'Map API did not load properly',
    });
  };

  /**
   * Get's the direction data based on locations and options selected
   */
  const getDirectionData = async () => {
    let count = 0;
    if (startingLocation?.geometry) {
      count++;
    }
    count += selectedLocations.length;

    if (count < 2) {
      return;
    }

    const url = new BcRouteLinkBuilder()
      .addPoints(startingLocation, selectedLocations)
      .addOptions(routeOptions)
      .build();

    await fetchDirection(url);
  };

  /**
   * Fetches direction data from api
   * @param {string} url BC routing link parameters
   */
  const fetchDirection = async (url: string) => {
    setRouteData(null);
    setDirectionError(null);
    try {
      const { data } = await getDirection({
        url: `/data/location/direction`,
        data: {
          uri: url,
        }
      });
      if(!data) throw 'Could not get route from api';
      setRouteData(data);
    } catch (e) {
      setDirectionError(e);
    }
  };

  /**
   * Creates google map link based on selected and starting locations
   * @returns google map uri
   */
  const createGoogleLink = () => {
    return new GoogleMapLinkBuilder()
      .addStartingPoint(startingLocation)
      .addLocations(selectedLocations)
      .build();
  };

  /**
   * Draws the GeoJson route on map
   */
  const drawRouteOnMap = () => {
    if (map && routeData) {
      const geoJSON = (GeoJSON as any).parse(routeData, {
        LineString: 'route',
      });
      const geoJsonLayer = L.geoJSON(geoJSON);
      setGeoJsonData(geoJsonLayer);
      geoJsonLayer.addTo(map);
    }
  };

  /**
   * Removes any drawn route from map
   */
  const removeRouteOnMap = () => {
    if (map && geoJsonData) {
      map.removeLayer(geoJsonData);
      geoJsonData.remove();
    }
  };

  // const onClickLocationPopupContent = (l: BusinessLocation) => ReactDOMServer.renderToString(
  //     <div>        
  //       <b><a id = "see-location-details-${l.id}">See Location Details</a></b>
  //       <hr />
  //       <b><a id = "add-to-itinerary">Add to Itinerary</a></b>
  //     </div>
  // );

  const onClickLocationPopupContent = (l: BusinessLocation): string => {
    return `<div>
              <b><a id = "see-location-details-${l.id}">See Location Details</a></b>
              <hr />
              <b><a id = "add-to-itinerary-${l.id}">Add to Itinerary</a></b>
            </div>`;
  };

  const onClickLocationMarker = (l: BusinessLocation) => {
    const locationId = `see-location-details-${l.id}`
    const itineraryId = `add-to-itinerary-${l.id}`
    
    const clickedLocationLink = document.getElementById(locationId);
    const addToItineraryLink = document.getElementById(itineraryId);

    clickedLocationLink.style.cursor = "pointer"
    addToItineraryLink.style.cursor = "pointer"

    if (clickedLocationLink) {
      clickedLocationLink.addEventListener("click", () => goToClickedLocation(l));
    }
    if (addToItineraryLink) {
      addToItineraryLink.addEventListener("click", () => setClickedLocation(l));
    }
  }

  const goToClickedLocation = (l: BusinessLocation) => {    
    history.push(`location/${l.id}`);
  }

  const drawHealthAuthorityLocationMarkers = () => {
    const mkrs: L.Marker[] = [];
    mkrs.push(...drawStartingMarker());

    if (healthAuthorityLocations?.length && map) {
      if (healthAuthorityLocations?.length && map) {
        healthAuthorityLocations.forEach((l) => {
        if (l.latitude && l.longitude) {
          let mkr = L.marker([+l.latitude, +l.longitude]);
          var redIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          var greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          let hasMissingReport = Object.values(l.reportStatus).includes("missing");

          if (hasMissingReport)
            mkr.setIcon(redIcon)
          else 
            mkr.setIcon(greenIcon)
        
          mkr.bindTooltip(makeMarkerToolTip(l)).openTooltip();
                     
          mkr                        
          .addEventListener("popupopen", () => onClickLocationMarker(l))
          .bindPopup(() => onClickLocationPopupContent(l));

          mkrs.push(mkr);
          mkr.addTo(map);
        }
      });
    }
    setMarkers(mkrs);
    setMapBound(mkrs);
    }
  }

  /**
   * If there is a change in locations or options it reinitialize all the markers and
   * gets fresh route data
   */
  useEffect(() => {
    removeAllMarkers();
    removeRouteOnMap();
    drawAllMarkers();
    getDirectionData();
  }, [startingLocation, routeOptions]);

  useEffect(() => {
    removeAllMarkers();
    removeRouteOnMap();
    drawHealthAuthorityLocationMarkers();
  }, [healthAuthorityLocations]);

  useEffect(() => {
    if (routeData) {
      removeRouteOnMap();
      drawRouteOnMap();
    }
  }, [routeData]);

  useEffect(() => {
    if (directionError) {
      removeRouteOnMap();
      showMapError(
        directionError.message ?? 'Error: Could not get direction data from API'
      );
    }
  }, [directionError]);

  useEffect(() => {
    if(showHALayer) {
      map?.addLayer(haLayer);
      map?.addControl(haLegend);
    } else {
      map?.removeLayer(haLayer);
      map?.removeControl(haLegend);
    }
  }, [showHALayer]);

  useEffect(() => {    
    if(displayItinerary) {
      //add the Ids of location selected from Health Authority view
      const ids = getLocationIds(selectedLocations);
      setRouteParam(ids);

      removeAllMarkers();
      removeRouteOnMap();
      drawAllMarkers();
      getDirectionData();
      setDisplayItinerary(false);
    }
  }, [displayItinerary])

  useEffect(() => {
    if(locationIds) {
      setTimeout(() => {
        setDisplayItinerary(true);
      }, 2000)      
    }   
  }, [])

  return {
    selectedLocations,
    setSelectedLocations,
    startingLocation,
    setStartingLocation,
    removeSelectedLocationHandler,
    addLocationToSelectedHandler,
    map,
    onRender,
    initialRoutingOptions,
    resetMapSize,
    showOnMapHandler,
    routeData,
    createGoogleLink,
    routeOptions,
    setRouteOptions,
    setShowHALayer,
    directionError,
    healthAuthorityLocations,
    setHealthAuthorityLocations,
    clickedLocation,
    setDisplayItinerary,
  };
}

/**
 * Adds Health Authority boundry layer to the map.
 * 
 * Layer is rendered as an image using the BC Imagery Web Map Services and is
 * based on the BC Health Authority Boundaries Dataset (https://catalogue.data.gov.bc.ca/dataset/health-authority-boundaries)
 * @param m Leaflet map where leayer needs to be added
 */
function createHealthAuthorityLayer() {
  // Add health authority boundary layer to map
  const mywms = L.tileLayer.wms('https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.BCHA_HEALTH_AUTHORITY_BNDRY_SP/ows?service=WMS', {
      layers: 'pub:WHSE_ADMIN_BOUNDARIES.BCHA_HEALTH_AUTHORITY_BNDRY_SP',
      format: 'image/png',
      transparent: true,
      version: '1.3.0',
      attribution: 'BC Map Services'
  });

  return mywms;
};

function createHealthAuthorityLegend() {
  // Add map legend to map
  const LegendControl = L.Control.extend({
    options: {
      position: 'bottomright'
    },
    onAdd: () => {
      const container = L.DomUtil.create('div', 'legendwrapper');
      container.innerHTML = `<img src="https://openmaps.gov.bc.ca/geo/pub/WHSE_ADMIN_BOUNDARIES.BCHA_HEALTH_AUTHORITY_BNDRY_SP/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=30&height=30&layer=pub%3AWHSE_ADMIN_BOUNDARIES.BCHA_HEALTH_AUTHORITY_BNDRY_SP">`;
      return container;
    }
  });
  
  return new LegendControl();
};

export default useLeaflet;
