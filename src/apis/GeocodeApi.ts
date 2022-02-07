import Config from 'react-native-config';

export const addrToCoord = async (addr: string) => {
  const {addresses} = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${addr}`,
    {
      headers: {
        'X-Ncp-Apigw-Api-Key': Config.CLIENT_SERVICE,
        'X-Ncp-Apigw-Api-Key-Id': Config.CLIENT_ID,
      },
    },
  )
    .then(res => res.json())
    .catch(err => console.log(err.message));

  const res = addresses[0];
  if (res) {
    return {x: res.x, y: res.y};
  }

  return undefined;
};

export const coordToAddr = async (lon: number, lat: number) => {
  const {results} = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lon},${lat}&output=json`,
    {
      headers: {
        'X-Ncp-Apigw-Api-Key': Config.CLIENT_SERVICE,
        'X-Ncp-Apigw-Api-Key-Id': Config.CLIENT_ID,
      },
    },
  )
    .then(res => res.json())
    .catch(err => console.log(err.message));

  return results[0].region.area1.name + ' ' + results[0].region.area2.name;
};
