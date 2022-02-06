import {XMLParser} from 'fast-xml-parser';
import {getCoord} from '../libs/getCoord';

export const propertyApi = async (code: string, ymd: string) => {
  const uri =
    'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTrade';
  const SERVICE_KEY =
    'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

  const {
    response: {
      body: {
        items: {item},
      },
    },
  } = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&LAWD_CD=${code}&DEAL_YMD=${ymd}`,
  )
    .then(res => res.text())
    .then(resText => {
      const parser = new XMLParser();
      return parser.parse(resText);
    })
    .catch(err => console.log(err.message));

  let items = item.map((obj: any) => {
    return {
      dealAmount: parseInt(obj['거래금액'].replace(',', '')),
      buildYear: obj['건축년도'],
      dealYear: obj['년'],
      dealMonth: obj['월'],
      dealDate: obj['일'],
      dong: obj['법정동'],
      apartmentName: obj['아파트'],
      area: Math.round(obj['전용면적'] / 3.3058),
      addressNumber: obj['지번'],
      code: obj['지역코드'],
      floor: obj['층'],
    };
  });

  let res: PropertyItem[] = [];

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

export const leasePropertyApi = async (
  code: string,
  ymd: string,
): Promise<LeasePropertyItem[]> => {
  const uri =
    'http://openapi.molit.go.kr:8081/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptRent';
  const SERVICE_KEY =
    'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

  const {
    response: {
      body: {
        items: {item},
      },
    },
  } = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&LAWD_CD=${code}&DEAL_YMD=${ymd}`,
  )
    .then(res => res.text())
    .then(resText => {
      console.log(resText);
      const parser = new XMLParser();
      return parser.parse(resText);
    })
    .catch(err => console.log(err.message));

  return item.map((obj: any) => {
    return {
      deposit:
        typeof obj['보증금액'] === 'string'
          ? parseInt(obj['보증금액'].replace(',', ''))
          : obj['보증금액'],
      monthlyRent: obj['월세'],
      dealYear: obj['년'],
      dealMonth: obj['월'],
      dealDate: obj['일'],
      apartmentName: obj['아파트'],
      area: Math.round(obj['전용면적'] / 3.3058),
      dong: obj['법정동'],
      floor: obj['층'],
    };
  });
};

type Base = {
  dealYear: number;
  dealMonth: number;
  dealDate: number;
  apartmentName: string;
  area: number;
  floor: number;
  dong: string;
};

type LeasePropertyItem = Base & {
  deposit: number;
  monthlyRent: number;
};

type PropertyItem = Base & {
  dealAmount: number;
  buildYear: number;
  addressNumber: number;
  latitude: number;
  longitude: number;
  code: number;
};
