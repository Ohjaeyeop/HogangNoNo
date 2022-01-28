import React, {useState} from 'react';
import NaverMapView, {Coord} from 'react-native-nmap';
import ItemMarker from './ItemMarker';
import {ApartmentType, getData} from '../../db/db';

type Props = {
  location: Coord;
};

const MapView = ({location}: Props) => {
  const [apartments, setApartments] = useState<ApartmentType[] | undefined>([]);
  const [regions, setRegions] = useState<Coord[]>([]);

  async function handleCameraChange(event: any) {
    if (event.zoom > 6) {
      const {zoom, contentRegion} = event;
      setRegions(contentRegion.slice(0, 4));
      await getData(
        {
          startX: contentRegion[0].latitude,
          startY: contentRegion[0].longitude,
          endX: contentRegion[1].latitude,
          endY: contentRegion[2].longitude,
        },
        zoom,
      )
        .then(res => setApartments(res))
        .catch(err => console.log(err.message));
    }
  }

  return (
    <>
      <NaverMapView
        style={{flex: 1}}
        zoomControl={false}
        compass={false}
        center={{...location, zoom: 14}}
        onCameraChange={handleCameraChange}
        maxZoomLevel={20}
        minZoomLevel={6}>
        {apartments &&
          apartments.map((apartment, index) => (
            <ItemMarker key={index} item={apartment} />
          ))}
      </NaverMapView>
    </>
  );
};

export default MapView;
