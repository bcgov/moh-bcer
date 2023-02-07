import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAxiosGet, useAxiosPatch } from './axios';

function useLocation(locationIds?: string) {
  const history = useHistory();
  const [selectedLocations, setSelectedLocations] = useState<BusinessLocation[]>([]);
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  /**
   * Fetching location data based on the given locationIds
   */
  const [{ data: locationWithId, error, loading }, getLocationWithIds] =
    useAxiosGet(`/data/location/ids/${locationIds}`, { manual: true });

  /**
   * Update a single location info
   */
  const [{ loading: patchLocationLoading, error: patchLocationError},patchLocation] = 
    useAxiosPatch(`/data/location/update-fields/${locationIds}`, { manual: true });

  useEffect(() => {
    if (locationIds) {
      getLocationWithIds();
    }
  }, []);

  useEffect(() => {
    if (locationWithId?.length) {
      setSelectedLocations(locationWithId);
    }
  }, [locationWithId]);

  useEffect(() => {
    if (error) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(error),
      });
    }
  }, [error]);

  /**
   * Removes a location from the selected locations array
   * @param {BusinessLocation} l location to remove from selected location array
   */
  const removeSelectedLocationHandler = (l: BusinessLocation) => {
    const temp = selectedLocations?.filter((loc) => loc.id != l.id);
    setSelectedLocations(temp);
    const ids = getLocationIds(temp);
    setRouteParam(ids);
  };

  /**
   * Adds a new location to the selected location array
   * @param {BusinessLocation} l location to add in the selected location array 
   */
  const addLocationToSelectedHandler = (l: BusinessLocation) => {
    setSelectedLocations([...selectedLocations, l]);    
    const ids = getLocationIds(selectedLocations, [l.id]);
    setRouteParam(ids);
  };

  /**
   * Updates the route parameters
   * @param {string} ids location ids to be set in the route query
   */
  const setRouteParam =  (ids: string[]) => {
    const route = history.location.pathname;
    history.push(`${route}?locations=${ids.join(',')}`);
  };

  /**
   * 
   * @param {BusinessLocation[]} loc array of business locations
   * @param {string[]} initial array containing initial address id
   * @returns an array of location ids
   */
  const getLocationIds = (
    loc: BusinessLocation[] = [],
    initial: string[] = []
  ): string[] => {
    return loc.reduce((prev, current) => [...prev, current?.id], initial);
  };

    /**
   * 
   * @param {type} the type of content to update. e.g.  addressLine1 || postal || webpage || phone || email || underage || manufacturing
   * @param {content} the new content to replace
   * @Update the info for a location
   */
    const updateLocationInfo = async (type: string, content: string) => {
      let body : {[type: string]:any} = {}
      body[type] = content;
      if(locationIds !== undefined){
        await patchLocation({
          data: body,
        });
      }
    };

  return {
    selectedLocations,
    setSelectedLocations,
    removeSelectedLocationHandler,
    addLocationToSelectedHandler,
    getLocationIds,
    setRouteParam,
    updateLocationInfo,
    patchLocationError
  };
}

export default useLocation;
