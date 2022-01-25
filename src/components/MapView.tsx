import React from 'react';
import NaverMapView, {Marker} from 'react-native-nmap';

type Props = {
  location:
    | {
        latitude: number;
        longitude: number;
      }
    | undefined;
};

const MapView = ({location}: Props) => {
  function getAddress(event: any) {}

  return (
    <>
      <NaverMapView
        style={{width: '100%', height: '90%'}}
        zoomControl={false}
        compass={false}
        center={location ? {...location, zoom: 16} : undefined}
        onCameraChange={getAddress}>
        {location && <Marker coordinate={location}></Marker>}
      </NaverMapView>
    </>
  );
};

export default MapView;
