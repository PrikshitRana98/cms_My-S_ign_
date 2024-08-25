import axios from "axios";
import { getStorageForKey } from "../Storage/asyncStorage";

//  export const baseUrl = 'http://k8s-neuro-ingressp-74011e45bf-569147679.ap-southeast-1.elb.amazonaws.com/'//DEV

//  export const baseUrl="https://signedgeuat.in.panasonic.com/"  //latest uat url

//  export const baseUrl="http://k8s-pana-ingressp-df7ebc2e50-807364959.ap-south-1.elb.amazonaws.com/"     //production url
 export const baseUrl="https://signedge.in.panasonic.com/" // main prod url

// export const baseUrl = "http://k8s-nn-ingressp-e1098695e7-209877555.ap-south-1.elb.amazonaws.com/"; // old url UAT

export const AxiosService = async (
  method = "GET",
  url = "",
  body = {},
  headers = {},
  success = () => {},
  failure = () => {},
  loaderText = ""
) => {
  const networkUrl = baseUrl + url;
  
  const token = await getStorageForKey("authToken");
  const slugId = await getStorageForKey("slugId");

  console.log("network--->",networkUrl,"\n")

  
  const authHeader = {
    Authorization:
      body?.type == "Basic" ? "Basic " + body?.credential : "Bearer " + token,
    "Content-Type": "application/json",
    Accept: "application/json",
    // "X-Tenant-Id": slugId,
  };

  switch (method) {
    case "GET":
      axios
        .get(networkUrl, { headers: authHeader })
        .then((response) => {
          if (success && response.status === 200) {
            success(response?.data);
          }
          // else{
          //   console.log("responseeeee get>---", JSON.stringify(response));
          // }
        })
        .catch((error) => {
          console.log("er---->",networkUrl)

          console.log("er---->22",JSON.stringify(error))
          failure(error);
        })
        .finally(() => {
          console.log(" ");
        });
      break;
    case "GETWIHOUTTOKEN":
        axios
          .get(networkUrl)
          .then((response) => {
            if (success && response.status === 200) {
              success(response?.data);
            }
            
          })
          .catch((error) => {
            failure(error);
          })
          .finally(() => {
            console.log(" ");
          });
        break;  
    case "POST":
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Accept: "application/json",
          ...authHeader,
        },
        body: JSON.stringify(body),
        redirect: "follow",
      };
      fetch(networkUrl, options)
        // axios
        //   .post(networkUrl, body, {headers})
        .then(async (response) => {
          const rs = await response.json();
          if (success) {
            success(rs);
          }
        })
        .catch((error) => {
          console.log("main error-->-=-0-11",networkUrl,"\n",JSON.stringify(options.body),"\n error==>",error)

          if(error.response){
            console.log("main error-->-=-0- line www",JSON.stringify(error.response))
          }
          if (failure) {
            failure(error);
            
          }
        })
        .finally(() => {
          //end loader here
        });
      break;
    case "PUT":
      console.log("upload data",body)
      axios
        .put(networkUrl, body, { headers: authHeader })
        .then((response) => {
          if (success) {
            success(response?.data);
          }
        })
        .catch((error) => {
          if (failure) {
            failure(error);
          }
        })
        .finally(() => {
          //end loader here
        });
      break;

    case "DELETE":
      axios
        .delete(networkUrl, { headers: authHeader, data: body })
        .then((response) => {
          if (success) {
            success(response?.data);
          }
        })
        .catch((error) => {
          if (failure) {
            failure(error);
          }
        });
      break;

    default:
      return null;
  }
};
