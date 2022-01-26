import React, {useState} from 'react';
import NaverMapView, {Coord, Marker} from 'react-native-nmap';
import {coordToAddr} from '../apis/GeocodeApi';
import {codes} from '../data/codes';
import {propertyApi} from '../apis/PropertyApi';
import {Image, Text, Platform, View} from 'react-native';
import ItemMarker from './ItemMarker';

type Props = {
  location: Coord | undefined;
};

const MapView = ({location}: Props) => {
  const [propertyItems, setPropertyItems] = useState();

  async function getAddress(event: any) {
    const region = event.contentRegion;
    console.log(region);
    // 좌표 -> 주소 -> 코드
    const code = await coordToAddr(
      region[0].longitude,
      region[0].latitude,
    ).then(addr => codes[addr]);

    propertyApi(code).then(items => setPropertyItems(items));
  }

  return (
    <>
      <NaverMapView
        style={{width: '100%', height: '90%'}}
        zoomControl={false}
        compass={false}
        center={location ? {...location, zoom: 16} : undefined}
        onCameraChange={getAddress}>
        {propertyItems &&
          propertyItems.map((item, index) => (
            <ItemMarker key={index} item={item} />
          ))}
      </NaverMapView>
    </>
  );
};

export default MapView;
