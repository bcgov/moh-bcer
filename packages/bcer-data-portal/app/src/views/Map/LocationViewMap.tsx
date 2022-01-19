
import Leaflet from '@/components/generic/Leaflet';
import useLeaflet from '@/hooks/useLeaflet';
import React, { useContext, useEffect, useRef, useState } from 'react';

export default function LocationViewMap({id, config}: any) {
  const { onRender } = useLeaflet(id, config);
  return (
    <>
      <Leaflet onRender={onRender} />
    </>
  )
}
