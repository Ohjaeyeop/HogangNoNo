export const geocodeApi = async (roadName: string, roadNumber: string) => {
  const {addresses} = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${roadName} ${roadNumber}`,
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
