import React from 'react';
import Map from './../Map/Map';
import { useAxiosGet } from '@/hooks/axios';
import { LocationConfig } from '@/constants/localInterfaces';
import LinearProgress from '@material-ui/core/LinearProgress';

function MapMenu() {

  const [{ data: config, error, loading }, getData] = useAxiosGet<LocationConfig>(
    '/data/location/config'
  );


  return (
    <>
      {loading && <LinearProgress />}
      {config && <Map config={config} asMenu={true} />}
    </>
  );
}

export default MapMenu;
