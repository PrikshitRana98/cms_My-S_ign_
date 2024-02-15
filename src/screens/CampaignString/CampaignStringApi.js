import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";

import { AxiosService } from "../../Services/AxiosService/axios";
import { updateCampaingnStringList } from "../../appConfig/Redux/Action/campaignStringAction";

const { dispatch } = Store;





export const CampaignStringManagerService = {
  fetchCampaignStringList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', params.endPoint, {}, {}, success, failure, 'Loading');
  },
  deleteCampaignString: (params = {}, success = () => {}, failure = () => {}) => { 
   console.log('params.ids',params.ids)
   let data = {
    ids:params.ids
   }
    AxiosService('DELETE', `content-management/cms/${params.slugId}/campaignString`,data, {}, success, failure, 'Loading');
  },
  cloneCampaignString: (params = {}, success = () => {}, failure = () => {}) => { 
    let data = params.ids
    AxiosService('POST', `content-management/cms/${params.slugId}/campaignString/clone/${data}`, {}, {}, success, failure, 'Loading');
  },
  deleteCampaign: (params = {}, success = () => {}, failure = () => {}) => { 
    console.log('params',params)
    // return false;
     AxiosService('PUT', `content-management/cms/${params.slugId}/campaignString/${params.data.campaignStringId}`,params.data, {}, success, failure, 'Loading');
   },
   addCampaignString: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "POST",
      `content-management/cms/${params.slugId}/campaignString`,
      params,
      {},
      success,
      failure,
      "Loading"
    );
  },
  editCampaignString: (layoutStringId = {},params = {},success = () => {},failure = () => {}) => {
    AxiosService("PUT",`content-management/cms/${params.slugId}/campaignString/${layoutStringId}`,params,{},success,failure,"Loading");
  },
  // http://k8s-neuro-ingressp-74011e45bf-569147679.ap-southeast-1.elb.amazonaws.com/content-management/cms/protons/campaign_string/60/submit
  submitCampaignString:(params = {},success = () => {},failure = () => {}) => {
    console.log('testtest',params)
    AxiosService("POST",`content-management/cms/${params.slugId}/campaign_string/${params.data.campaignStringId}/submit`,{},{},success,failure,"Loading");
  },
  fetchCampaignRatioList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/campaign/search?aspectRatioId=${params.aspect_ratio}&state=SUBMITTED,PUBLISHED,APPROVED`, {}, {}, success, failure, 'Loading');
  },
  fetchCampaignDetails:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparams=',params)
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/campaign/${params.ids}`, {}, {}, success, failure, 'Loading');
  },
  onApprove: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `service-gateway/cms/${params.slugId}/campaign_string/${params.campaignString}/approve`, {}, {}, success, failure, 'Loading');
  },
  onCancelApprove: (params = {}, success = () => {}, failure = () => {}) => {
    let data={comment: params?.reason}
    AxiosService('POST', `service-gateway/cms/${params.slugId}/campaign_string/${params.campaignString}/reject`, data, {}, success, failure, 'Loading');
  },
  fetchCampaignStringDetails:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparams=',params)
    AxiosService('GET', `service-gateway/cms/${params.slugId}/campaignString/${params.campaignStringId}`, {}, {}, success, failure, 'Loading');
  },
  getDatabyLoc: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", params.endPoint, params.params, {}, success, failure, "Loading");
  },
}

export const getCampaignStringData = async (endPoint,setIsLoading = () => {}) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true); 
  const successCallBack = async (response) => {
    console.log('getCampaignStringDataresponseSuccess',response)
    if(response?.code === 200){
      dispatch(updateCampaingnStringList(response))
    }
    setIsLoading(false);
  };

  const errorCallBack = (response) => {
    console.log('getCampaignStringDataresponseError',response)
    setIsLoading(false);
  };

  CampaignStringManagerService.fetchCampaignStringList(
    { slugId,endPoint },
    successCallBack,
    errorCallBack
  );
};