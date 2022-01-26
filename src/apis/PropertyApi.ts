import {XMLParser} from 'fast-xml-parser';
import {addrToCoord} from './GeocodeApi';

const uri =
  'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade';
const SERVICE_KEY =
  'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

export const propertyApi = async (code: string) => {
  const {
    response: {
      body: {
        items: {item},
      },
    },
  } = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&LAWD_CD=${code}&DEAL_YMD=202101`,
  )
    .then(res => res.text())
    .then(resText => {
      const parser = new XMLParser();
      return parser.parse(resText);
    })
    .catch(err => console.log(err.message));

  let items = item.map((obj: any) => {
    return {
      dealAmount: parseInt(obj['거래금액'].replace(',', '')) / 10000,
      buildYear: obj['건축년도'],
      dealYear: obj['년'],
      dealMonth: obj['월'],
      dealDate: obj['일'],
      dong: obj['법정동'],
      apartmentName: obj['아파트'],
      area: Math.ceil(obj['전용면적'] / 3.3058 + 0.5),
      addressNumber: obj['지번'],
    };
  });

  items = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    items.map(async (item: any) => {
      const {x, y} = await addrToCoord(item.dong, item.addressNumber);
      return {...item, longitude: parseFloat(x), latitude: parseFloat(y)};
    }),
  );

  return items;
};
