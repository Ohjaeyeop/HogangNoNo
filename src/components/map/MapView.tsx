import React, {useRef, useState} from 'react';
import NaverMapView, {Coord} from 'react-native-nmap';
import ItemMarker from './ItemMarker';
import {
  getData,
  getPropertyTypeByZoom,
  Property,
  PropertyType,
} from '../../db/db';
import {useNavigation} from '@react-navigation/native';
import {HomeProps} from '../../App';

type Props = {
  location: Coord;
};

const MapView = ({location}: Props) => {
  const [apartments, setApartments] = useState<
    Property<'Apartment'>[] | undefined
  >([]);
  const [zoom, setZoom] = useState(0);
  const navigation = useNavigation<HomeProps['navigation']>();
  const mapRef = useRef<NaverMapView>(null);
  const [center, setCenter] = useState<Coord>(location);
  const [centerZoom, setCenterZoom] = useState(14);

  async function handleCameraChange(event: any) {
    setZoom(event.zoom);
    if (event.zoom > 6) {
      const {zoom, contentRegion} = event;
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

  const onPressApartment = (item: Property<'Apartment'>) => {
    navigation.navigate('Detail', {
      name: item.name,
      dealAmount: item.dealAmount,
      buildYear: item.buildYear,
      area: item.area,
    });
  };

  const onPressDong = (item: Property<'Dong'>) => {
    setCenter({latitude: item.latitude, longitude: item.longitude});
    setCenterZoom(14);
  };

  const onPressGu = (item: Property<'Gu'>) => {
    setCenter({latitude: item.latitude, longitude: item.longitude});
    setCenterZoom(12);
  };

  const onPress = (item: Property<typeof type>, type: PropertyType) => {
    if (type === 'Apartment') {
      onPressApartment(item);
    } else if (type === 'Dong') {
      onPressDong(item);
    } else if (type === 'Gu') {
      onPressGu(item);
    }
  };

  return (
    <NaverMapView
      ref={mapRef}
      style={{flex: 1}}
      zoomControl={false}
      compass={false}
      center={{...center, zoom: centerZoom}}
      onCameraChange={handleCameraChange}
      maxZoomLevel={20}
      minZoomLevel={6}>
      {apartments &&
        apartments.map((apartment, index) =>
          apartment.dealAmount ? (
            <ItemMarker
              key={index}
              item={apartment}
              onPress={onPress}
              type={getPropertyTypeByZoom(zoom)}
            />
          ) : null,
        )}
    </NaverMapView>
  );
};

export default MapView;
