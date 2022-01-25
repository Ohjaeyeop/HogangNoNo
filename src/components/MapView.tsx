import React from 'react';
import NaverMapView, {Coord, Marker} from 'react-native-nmap';
import {coordToAddr} from '../apis/GeocodeApi';
import {codes} from '../data/codes';
import {propertyApi} from '../apis/PropertyApi';

type Props = {
  location: Coord | undefined;
};

const MapView = ({location}: Props) => {
  async function getAddress(event: any) {
    const region = event.contentRegion;
    // 좌표를 주소로 변경
    const code = await coordToAddr(
      region[0].longitude,
      region[0].latitude,
    ).then(addr => codes[addr]);

    propertyApi(code);
  }

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
