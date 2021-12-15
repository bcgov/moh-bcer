import React from 'react';
import GoogleMapReact from 'google-map-react';

function GoogleMap({onGoogleApiLoaded}: any) {

 

  // (async ()=>{
  //   if (navigator.geolocation) {
  //     // geolocation is available
  //      navigator.geolocation.getCurrentPosition((location)=>{console.log(location)}, (location)=>{console.log(location)})
  //   } 
  //   else {
  //     // geolocation is not supported
  //   }
  // })()

  const apiIsLoaded = (map: any, maps: any) => {
    const directionsService = new maps.DirectionsService();
    const directionsRenderer = new maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    const origin = { lat: 44.2397752, lng: -76.5792992 };
    const destination = { lat: 41.756795, lng: -78.954298 };
    const waypoints = [
      {location: {lat: 43.6532, lng: -79.3832}, stopover: true}
    ]

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: maps.TravelMode.DRIVING,
        waypoints
      },
      (result :any, status: any) => {
        const route = result.routes[0]
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
  
          // console.log(route.legs[i].start_address + " to " + route.legs[i].end_address + route.legs[i].distance!.text)
          console.log(route.legs[i]);
        }
  
        if (status === maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  return (
    <div>
      <div style={{ height: 'calc(100vh - 110px)', width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "YOUR_API_KEY"
          }}
          defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
          defaultZoom={10}
          center={{ lat: 40.756795, lng: -73.954298 }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => onGoogleApiLoaded(map, maps)}
        />
      </div>
    </div>
  );
}
export default GoogleMap;

