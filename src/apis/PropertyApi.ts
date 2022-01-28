import {XMLParser} from 'fast-xml-parser';
import {getCoord} from '../libs/getCoord';

const uri =
  'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade';
const SERVICE_KEY =
  'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

export const propertyApi = async (code: string, ymd: string) => {
  const {
    response: {
      body: {
        items: {item},
      },
    },
  } = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&LAWD_CD=11110&DEAL_YMD=${ymd}`,
  )
    .then(res => res.text())
    .then(resText => {
      const parser = new XMLParser();
      return parser.parse(resText);
    })
    .catch(err => console.log(err.message));

  let items = item.map((obj: any) => {
    return {
      dealAmount:
        Math.round(parseInt(obj['거래금액'].replace(',', '')) / 1000) / 10,
      buildYear: obj['건축년도'],
      dealYear: obj['년'],
      dealMonth: obj['월'],
      dealDate: obj['일'],
      dong: obj['법정동'],
      apartmentName: obj['아파트'],
      area: Math.round(obj['전용면적'] / 3.3058),
      addressNumber: obj['지번'],
      code: obj['지역코드'],
    };
  });

  let res = [];
  // eslint-disable-next-line @typescript-eslint/no-shadow
  for (const item of items) {
    const coord = await getCoord(`${item.dong} ${item.addressNumber}`);
    if (coord) {
      res.push({
        ...item,
        longitude: parseFloat(coord.x),
        latitude: parseFloat(coord.y),
      });
    }
  }

  return res;
};

export type ItemType = {
  dealAmount: number;
  buildYear: number;
  dealYear: number;
  dealMonth: number;
  dealDate: number;
  dong: string;
  apartmentName: string;
  area: number;
  addressNumber: number;
  latitude: number;
  longitude: number;
  code: number;
};
