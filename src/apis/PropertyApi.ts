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

  console.log(item);

  const location = item.map((value: any) =>
    geocodeApi(value['도로명'], value['도로명건물본번호코드']),
  );

  return item;
};
