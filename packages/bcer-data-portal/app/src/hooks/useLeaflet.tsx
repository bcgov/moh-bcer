import React, { useContext, useEffect, useState } from 'react';
import L from 'leaflet';
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

function useLeaflet(locationIds: string, config: LocationConfig) {
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);

  const [routeData, setRouteData] = useState<BCDirectionData>();
  const [directionError, setDirectionError] = useState<any>();

  const {
    selectedLocations,
    setSelectedLocations,
    removeSelectedLocationHandler,
    addLocationToSelectedHandler,
  } = useLocation(locationIds);

  const [map, setMap] = useState<L.Map>();
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<L.GeoJSON>();
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
   * @param mkrs
   */
  const setMapBound = (mkrs: L.Marker[]) => {
    if (map && mkrs?.length) {
      const group = new (L.featureGroup as any)(mkrs);
      map.fitBounds(group.getBounds());
    }
  };

  /**
   * Draws a unique marker for the starting location
   * @returns
   */
  const drawStartingMarker = (): L.Marker[] => {
    if (startingLocation?.geometry?.coordinates && map) {
      var startingIcon = new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
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
   * @param l
   * @returns
   */
  const makeMarkerToolTip = (l: BusinessLocation): string => {
    return `<div style="text-align:center;"><b>${safeGuardHtmlString(
      l.business?.businessName ?? l.business?.legalName
    )}</b><br/>${safeGuardHtmlString(l?.geoAddress ?? l.addressLine1)}</div>`;
  };

  /**
   * Tool tip string is injected as html. This function makes sure to safe guard against user input.
   * @param text
   * @returns
   */
  const safeGuardHtmlString = (text: string) => {
    return (
      text?.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '') ?? ''
    );
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
   * @param m map
   * Adds Tile style to map
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
   * @param l
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
   *
   * @param message
   * Displays error toast to the user
   */
  const showMapError = (message?: string) => {
    setAppGlobalContext({
      ...appGlobal,
      networkErrorMessage: message || 'Map API did not load properly',
    });
  };

  /**
   * Get's the direction data based on locations and options selected
   * @returns
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

    const url = new BcRouteLinkBuilder(config.bcDirectionApiKey)
      .addPoints(startingLocation, selectedLocations)
      .addOptions(routeOptions)
      .build();

    await fetchDirection(encodeURI(url));
  };

  /**
   * To Fetch direction data from bc government service
   * AxiosGet adds the Authorization header by default and
   * that was causing the request to fail so using fetch instead
   * @param url URI encoded link
   */
  const fetchDirection = async (url: string) => {
    setRouteData(null);
    setDirectionError(null);
    try {
      const data = await fetch(encodeURI(url), {
        headers: {
          apiKey: config.bcDirectionApiKey,
        },
      });
      const res = await data.json();
      setRouteData(res);
    } catch (e) {
      setDirectionError(e);
    }
  };

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

  const removeRouteOnMap = () => {
    if (map && geoJsonData) {
      map.removeLayer(geoJsonData);
      geoJsonData.remove();
    }
  };

  /**
   * If there is a change in locations or options it reinitialize all the markers and
   * gets fresh route data
   */
  useEffect(() => {
    removeAllMarkers();
    removeRouteOnMap();
    drawAllMarkers();
    getDirectionData();
  }, [selectedLocations, startingLocation, routeOptions]);

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
    directionError,
  };
}

export default useLeaflet;
