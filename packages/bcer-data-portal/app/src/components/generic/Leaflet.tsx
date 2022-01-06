import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function Leaflet({ onRender }: any) {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [20, 32],
    iconAnchor: [10, 32],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  useEffect(() => {
    onRender();
  }, []);
  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
}

export default Leaflet;
