import {XMLParser} from 'fast-xml-parser';
import {geocodeApi} from './GeocodeApi';

const uri =
  'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev';
const SERVICE_KEY =
  'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

export const propertyApi = async () => {
  const {
    response: {
      body: {
        items: {item},
      },
    },
  } = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&LAWD_CD=11110&DEAL_YMD=202101`,
  )
    .then(res => res.text())
    .then(resText => {
      const parser = new XMLParser();
      return parser.parse(resText);
    })
    .catch(err => console.log(err.message));

  let items = item.map((obj: any) => {
    return {
      dealAmount: obj['거래금액'],
      buildYear: obj['건축년도'],
      dealYear: obj['년'],
      dealMonth: obj['월'],
      dealDate: obj['일'],
      roadName: obj['도로명'],
      roadNameNumber: obj['도로명건물본번호코드'],
      dong: obj['법정동'],
      apartmentName: obj['아파트'],
      area: obj['전용면적'],
    };
  });

  items = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    items.map(async (item: any) => {
      const {x, y} = await geocodeApi(item.roadName, item.roadNameNumber);
      return {...item, x, y};
    }),
  );

  return items;
};
