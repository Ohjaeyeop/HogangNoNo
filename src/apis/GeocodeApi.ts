export const addrToCoord = async (dong: string, addressNumber: string) => {
  const {addresses} = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${dong} ${addressNumber}`,
    {
      headers: {
        'X-Ncp-Apigw-Api-Key': 'iJe3buh1uq99KV0ZthmvechyGxinnrvXGTrRp8E1',
        'X-Ncp-Apigw-Api-Key-Id': 'y25v6uespk',
      },
    },
  )
    .then(res => res.json())
    .catch(err => console.log(err.message));

  const {x, y} = addresses[0];

  return {x, y};
};

export const coordToAddr = async (lon: number, lat: number) => {
  const {results} = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lon},${lat}&output=json`,
    {
      headers: {
        'X-Ncp-Apigw-Api-Key': 'iJe3buh1uq99KV0ZthmvechyGxinnrvXGTrRp8E1',
        'X-Ncp-Apigw-Api-Key-Id': 'y25v6uespk',
      },
    },
  )
    .then(res => res.json())
    .catch(err => console.log(err.message));

  return results[0].region.area1.name + ' ' + results[0].region.area2.name;
};
