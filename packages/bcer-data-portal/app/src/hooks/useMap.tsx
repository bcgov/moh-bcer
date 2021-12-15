import React, { useState } from 'react';

function useMap(locationIds: string) {
  const [map, setMap] = useState();
  const [maps, setMaps] = useState();

  const onGoogleApiLoaded = (map: any, maps: any) => {
    setMap(map);
    setMaps(maps);

    maps.Marker({
      position: {lat: 44, lon: -76},
      map,
      title: "Hello World!",
    });
  };

  return {
    map,
    maps,
    onGoogleApiLoaded,
  };
}

export default useMap;
