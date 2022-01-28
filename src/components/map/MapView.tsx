import React, {useRef, useState} from 'react';
import NaverMapView, {Coord} from 'react-native-nmap';
import {coordToAddr} from '../../apis/GeocodeApi';
import ItemMarker from './ItemMarker';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchItems, removeRegions} from '../../redux/propertySlice';
import {regionCodes} from '../../data/regionInfos';

type Props = {
  location: Coord;
};

const MapView = ({location}: Props) => {
  const dispatch = useAppDispatch();
  const propertyItems = useAppSelector(state => state.property.entities);
  const currentCodes = useAppSelector(state => state.property.ids);
  const [regions, setRegions] = useState<Coord[]>([]);
  const regionsRef = useRef<Coord[]>([]);

  async function handleCameraChange(event: any) {
    if (event.zoom > 13) {
      /*      regionsRef.current = event.contentRegion.slice(0, 4);
      setRegions(regionsRef.current);
      // 좌표 -> 주소 -> 코드
      const tempCodes = await Promise.all(
        regionsRef.current.map(async (region: Coord) => {
          return await coordToAddr(
            region.longitude,
            region.latitude,
            // @ts-ignore
          ).then(addr => regionCodes[addr]);
        }),
      );
      const newCodes = new Set(tempCodes);
      const addedCodes = [...newCodes].filter(
        code => !currentCodes.includes(code),
      );
      const toRemove = currentCodes.filter(code => !newCodes.has(code));
      toRemove.length && dispatch(removeRegions(toRemove));
      // 부동산 정보 불러오기
      addedCodes.length && dispatch(fetchItems(addedCodes));*/
    }
  }

  return (
    <>
      <NaverMapView
        style={{flex: 1}}
        zoomControl={false}
        compass={false}
        center={{...location, zoom: 16}}
        onCameraChange={handleCameraChange}>
        {propertyItems &&
          Object.entries(propertyItems).map(value =>
            value[1].map((item, index) => {
              return <ItemMarker key={index} item={item} />;
            }),
          )}
      </NaverMapView>
    </>
  );
};

export default MapView;
