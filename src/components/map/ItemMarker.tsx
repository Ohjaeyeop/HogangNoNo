import React from 'react';
import {Platform, TouchableWithoutFeedback} from 'react-native';
import {Align, Marker} from 'react-native-nmap';
import {Property, PropertyType} from '../../db/db';

const ItemMarker = ({
  item,
  onPress,
  type,
}: {
  item: Property<typeof type>;
  onPress: (item: Property<typeof type>, type: PropertyType) => void;
  type: PropertyType;
}) => {
  const markerProps =
    Platform.OS === 'android'
      ? {
          subcaption: `${
            'area' in item
              ? Math.round(item.dealAmount / 1000) / 10
              : item.dealAmount
          }억`,
        }
      : {
          subCaption: {
            text: `${
              'area' in item
                ? Math.round(item.dealAmount / 1000) / 10
                : item.dealAmount
            }억`,
            color: 'white',
            haloColor: 'transparent',
          },
        };
  return (
    <TouchableWithoutFeedback onPress={() => onPress(item, type)}>
      <Marker
        {...markerProps}
        coordinate={{latitude: item.latitude, longitude: item.longitude}}
        image={require('../../../assets/images/marker.png')}
        caption={{
          text:
            'area' in item
              ? `${item.area}평`
              : 'gu' in item
              ? item.name.split(' ')[1]
              : item.name,
          color: '#ffffff',
          align: Align.Center,
          haloColor: 'transparent',
        }}
        width={64}
        height={54}
        anchor={{x: -1, y: 1}}
        pinColor={'black'}
      />
    </TouchableWithoutFeedback>
  );
};

export default ItemMarker;
