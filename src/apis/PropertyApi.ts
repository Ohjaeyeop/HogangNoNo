import {XMLParser} from 'fast-xml-parser';

const uri =
  'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev';
const SERVICE_KEY =
  'Os0BvUN73dbFsXA8O3jtA4bPKaxXGxoW7C88n6DpgNyVrssis9u3RLTGl7yxRCJimPkKY0yCD9dUeK4M8vK1BA%3D%3D';

export const propertyApi = async () => {
  const items = await fetch(
    `${uri}?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=10&LAWD_CD=11110&DEAL_YMD=202101`,
  )
    .then(res => res.text())
    .then(resText => {
      const parser = new XMLParser();
      const jsonObj = parser.parse(resText);
      return jsonObj.response.body.items.item;
    })
    .catch(err => console.log(err.message));
  console.log(items);
  return items;
};
