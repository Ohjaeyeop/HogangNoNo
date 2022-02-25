import React, {useEffect, useRef, useState} from 'react';
import NaverMapView, {Coord, Marker} from 'react-native-nmap';
import ItemMarker from './ItemMarker';
import {
  getDisplayedData,
  getPropertyTypeByZoom,
  Property,
  PropertyType,
} from '../../db/db';
import {useNavigation} from '@react-navigation/native';
import {HomeProps} from '../../App';

type Props = {
  location: Coord;
  myLocation: Coord | undefined;
  handlePress: () => void;
};

const MapView = ({location, myLocation, handlePress}: Props) => {
  const [apartments, setApartments] = useState<
    Property<'Apartment'>[] | undefined
  >([]);
  const [zoom, setZoom] = useState(0);
  const navigation = useNavigation<HomeProps['navigation']>();
  const mapRef = useRef<NaverMapView>(null);
  const [center, setCenter] = useState<Coord>(location);
  const [centerZoom, setCenterZoom] = useState(14);
  const [isOver, setIsOver] = useState(false);
  const isFirst = useRef(true);

  useEffect(() => {
    mapRef.current?.animateToCoordinate(location);
  }, [location]);

  async function handleCameraChange(event: any) {
    setZoom(event.zoom);
    if (event.zoom >= 9 && !isFirst.current) {
      setIsOver(false);
      const {zoom, contentRegion} = event;
      await getDisplayedData(
        {
          startX: contentRegion[0].latitude,
          startY: contentRegion[0].longitude,
          endX: contentRegion[1].latitude,
          endY: contentRegion[2].longitude,
        },
        zoom,
      ).then(data => setApartments(data));
    } else {
      setIsOver(true);
    }
    isFirst.current = false;
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
      minZoomLevel={8}
      rotateGesturesEnabled={false}
      onMapClick={() => handlePress()}
      useTextureView={true}>
      {!isOver &&
        apartments &&
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
      {myLocation && (
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          zIndex={1}
          pinColor={'red'}
        />
      )}
    </NaverMapView>
  );
};

export default MapView;
