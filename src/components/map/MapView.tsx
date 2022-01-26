import React, {useState} from 'react';
import NaverMapView, {Coord} from 'react-native-nmap';
import {coordToAddr} from '../../apis/GeocodeApi';
import {codes} from '../../data/codes';
import {ItemType, propertyApi} from '../../apis/PropertyApi';
import ItemMarker from './ItemMarker';

type Props = {
  location: Coord | undefined;
};

const MapView = ({location}: Props) => {
  const [propertyItems, setPropertyItems] = useState<ItemType[]>([]);
  const [currentCodes, setCurrentCodes] = useState<Set<string>>(new Set());

  async function getAddress(event: any) {
    if (event.zoom > 13) {
      const regions = event.contentRegion.slice(0, 4);
      // 좌표 -> 주소 -> 코드
      const tempCodes = await Promise.all(
        regions.map(async (region: Coord) => {
          return await coordToAddr(
            region.longitude,
            region.latitude,
            // @ts-ignore
          ).then(addr => codes[addr]);
        }),
      );
      const newCodes = new Set(tempCodes);
      const addedCodes = [...newCodes].filter(code => !currentCodes.has(code));

      // 부동산 정보 불러오기
      await Promise.all(
        addedCodes.map(async code => {
          propertyApi(code).then(items => setPropertyItems(items));
        }),
      );

      setCurrentCodes(newCodes);
    }
  }

  return (
    <>
      <NaverMapView
        style={{flex: 1}}
        zoomControl={false}
        compass={false}
        center={location ? {...location, zoom: 16} : undefined}
        onCameraChange={getAddress}>
        {propertyItems &&
          propertyItems.map((item: ItemType, index: number) => (
            <ItemMarker key={index} item={item} />
          ))}
      </NaverMapView>
    </>
  );
};

export default MapView;
