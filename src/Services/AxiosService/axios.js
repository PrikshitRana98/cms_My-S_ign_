import axios from "axios";
import { getStorageForKey } from "../Storage/asyncStorage";

// export const baseUrl = 'http://k8s-neuro-ingressp-74011e45bf-569147679.ap-southeast-1.elb.amazonaws.com/'//DEV
export const baseUrl = "http://k8s-nn-ingressp-e1098695e7-209877555.ap-south-1.elb.amazonaws.com/"; //UAT

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

  console.log("networkUrl", networkUrl);
  // console.log("token", token);
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
          // console.log("responseeeee", JSON.stringify(response));
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
          console.log("main error-->",error)
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
