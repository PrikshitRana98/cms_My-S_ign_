import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { AxiosService } from "../../Services/AxiosService/axios";


const { dispatch } = Store;

export const MediaApiService = {
    getMediaByID: (params = {}, success = () => {}, failure = () => {}) => {
                AxiosService("GET", params.endPoint, {}, {}, success, failure, "Loading");
    },

    // http://k8s-neuro-ingressp-74011e45bf-569147679.ap-southeast-1.elb.amazonaws.com/service-gateway/cms/qmstesth/v1/total-media-archive-count

    getMediaCount: (params = {}, success = () => {}, failure = () => {}) => {
        AxiosService("GET", params.endPoint, {}, {}, success, failure, "Loading");
    },

    
  
}