import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import {
  updateCampaingnArchiveList,
  updateCampaingnList,
} from "../../appConfig/Redux/Action/campaignAction";
import { AxiosService } from "../../Services/AxiosService/axios";
import { updateMediaLib } from "../../appConfig/Redux/Action/mediaLibAction";
import { updateTemplates } from "../../appConfig/Redux/Action/templateManagerAction";
import { updatePlonogramList } from "../../appConfig/Redux/Action/plonogramAction";
import { removeSchedulerList, updateSchedulerList } from "../../appConfig/Redux/Action/schedulerAction";

import { setDevice, setDeviceGroup, setLocationList } from "../../appConfig/Redux/Action/commonAction";
const { dispatch } = Store;

export const getSchedulerList = async (
  endPoint,
  setIsLoading = () => {},
) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
   
    dispatch(updateSchedulerList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const errorCallBack = (response) => {
   
    setIsLoading(false);
  };

  SchedulerManagerService.fetchSchedularList(
    { slugId, endPoint },
    successCallBack,
    errorCallBack
  );
};


export const SchedulerManagerService = {
  fetchSchedularList: (params = {}, success = () => {}, failure = () => {}) => {
              AxiosService("GET", params.endPoint, {}, {}, success, failure, "Loading");
  },
  fetchLocationListSearch: (params = {}, success = () => {}, failure = () => {}) => {

    AxiosService("GET", `location-management/lcms/${params.slugId}/v1/location/search?location-name=${params.searchLoc}`, {}, {}, success, failure, "Loading");
  },
  fetchLocationList: (params = {}, success = () => {}, failure = () => {}) => {

    AxiosService("GET", `location-management/lcms/${params.slugId}/v1/location-hierarchy`, {}, {}, success, failure, "Loading");
  },
  Countbystate: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `capsuling-service/api/capsuling/countByState`, {}, {}, success, failure, "Loading");
  },

  Workflow: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", params.endpoint, {}, {}, success, failure, "Loading");
  },

  GetTenent: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", params.endpoint, {}, {}, success, failure, "Loading");
  },

  searchList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", params.endpoint, {}, {}, success, failure, "Loading");
  },
  getDeviceGroupListByLocations:(params = {}, success = () => {}, failure = () => {})=>{
    let ids="";
    if(params.ids.length>0){
      params.ids?.map((item)=>{
        if(ids==""){
          ids=`locationIds=${item}`
        }else{
          ids=ids+`&locationIds=${item}`;
        } 
      })
    }
    AxiosService("GET",`device-management/api/deviceGroup/planogram?${ids}`,{}, {},success,failure,"Loading");
  },
  deleteSchedulerString: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    let data = {
      ids: params.ids,
    };
    
    AxiosService(
      "DELETE",
      `capsuling-service/api/capsuling/deletePlanograms`,
      params.ids,
      {},
      success,
      failure,
      "Loading"
    );
  },

  StopSchedulerString: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    
    
    AxiosService(
      "PUT",
      `capsuling-service/api/capsuling/stopPlanogram/${params.id}`,
      params.ids,
      {},
      success,
      failure,
      "Loading"
    );
  },

  addschedduler: (params = {},success = () => {},failure = () => {} ) => {
    let data = params.data;
    AxiosService("POST",`capsuling-service/api/capsuling/createPlanogram`,data,{},success,failure,"Loading");
  },
  getPlanogramDetail: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",`capsuling-service/api/capsuling/getPlanogram/${params.planogramId}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },

  fetchDeviceLogicList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `content-management/cms/${params?.slugId}/planogram/device-logic/${params?.planogramID}`, {}, {}, success, failure, "Loading");
  },
  
  fetchmediaid1: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `content-management/cms/${params?.slugId}/v1/media/${params?.mediaid}`, {}, {}, success, failure, "Loading");
  },
  fetchmediaid: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `content-management/cms/${params?.slugId}/v1/campaign/${params?.campid}`, {}, {}, success, failure, "Loading");
  },
  editschedduler: (params = {},success = () => {},failure = () => {}) => {
    AxiosService("PUT",`capsuling-service/api/capsuling/updatePlanogram/${params.planogramId}`,params.data,{},success,failure,"Loading");
  },
  ratioIdString: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    
    AxiosService(
      "GET",
      `content-management/cms/${params.slugId}/v1/aspect-ratio/${params.ids}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  updateDeviceLogicPlanogram: (params = {},success = () => {},failure = () => {} ) => {
    AxiosService("POST",`capsuling-service/api/capsuling/associateDevicesWithPlanoram?planogramId=${params.planogramId}&${params.postData}`,'',{},success,failure,"Loading");
  },

  rejectScheduler: (params = {},success = () => {},failure = () => {} ) => {
    let data = params.data;
    AxiosService("POST",`service-gateway/cms/${params.slugid}/planogram/${params.planogramId}/reject`,data,{},success,failure,"Loading");
  },
  acceptScheduler: (params = {},success = () => {},failure = () => {} ) => {
    let endpoint = `service-gateway/cms/${params.slugid}/planogram/${params.planogramId}/approve`
    AxiosService("POST",`service-gateway/cms/${params.slugid}/planogram/${params.planogramId}/approve`,{},{},success,failure,"Loading");
  },

  getCampaignStringByAspectRatio: ( params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`capsuling-service/api/capsuling/getPlanogramCampaigns/${params.palamid}`,'',{},success,failure,"Loading");
  },

  getCampaigns: ( params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`capsuling-service/api/capsuling/getCampaigns?planogramId=${params.palamid}`,'',{},success,failure,"Loading");
  },
  
  createcampiegn: (params = {},success = () => {},failure = () => {} ) => {
    let data = params.data;
    AxiosService("POST",`capsuling-service/api/capsuling/addCampaign`,data,{},success,failure,"Loading");
  },
  publishcomp: (params = {},success = () => {},failure = () => {} ) => {
    AxiosService("PUT",`capsuling-service/api/capsuling/setCampaignsPriority/${params.palamid}`,params.params1,{},success,failure,"Loading");
  },
  publishcomp1: (params = {},success = () => {},failure = () => {} ) => {
    AxiosService("PUT",`capsuling-service/api/capsuling/publishPlanogram/${params.palamid}`,'',{},success,failure,"Loading");
  },

  publishcomp2: (params = {},success = () => {},failure = () => {} ) => {
    let endpoint = `service-gateway/cms/${params.slugid}/planogram/${params.palamid}/submit`
    AxiosService("POST",`service-gateway/cms/${params.slugid}/planogram/${params.palamid}/submit`,{},{},success,failure,"Loading");
  },
  getDeviceListByLocations:(params = {}, success = () => {}, failure = () => {})=>{
    let ids="";
    if(params.ids.length>0){
      params.ids?.map((item)=>{
        if(ids==""){
          ids=`locationIds=${item}`
        }else{
          ids=ids+`&locationIds=${item}`;
        } 
      })
    }
    AxiosService("GET",`device-management/api/device/planogram?${ids}`,{}, {},success,failure,"Loading");
  },
  
  getAllDevices:(params = {}, success = () => {}, failure = () => {})=>{
    AxiosService("POST",`device-management/api/device/getAllBySearchCriteria`,params, {},success,failure,"Loading");
  },


};

export const bulkSchedulerDelete=async(
  params={},
  setIsLoading = () => {}
  )=>{

  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    dispatch(removeSchedulerList(response));
    Alert.alert("Success","Data Delete Successfully")
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const errorCallBack = (response) => {
    setIsLoading(false);
  };

  SchedulerManagerService.deleteSchedulerString(
    {...params, slugId},
    successCallBack,
    errorCallBack
  );
}
export const getDeviceByLocation=async(params,setIsLoading = () => {},)=>{
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    if(params.ids.length>0){
      if(response?.result?.length>0){
        dispatch(setDevice(response?.result))
      }else{
        dispatch(setDevice([]))
      }
    }else{
      if(response?.content?.length>0){
        dispatch(setDevice(response?.content))
      }else{
        dispatch(setDevice([]))
      }
    }
    setIsLoading(false);
    
  };


  const errorCallBack = (error) => {
    
    setIsLoading(false);
    if(error?.message){
      Alert.alert(error.message);
    }
  };
  if(params.ids.length>0){
    SchedulerManagerService.getDeviceListByLocations(
      { slugId,ids:params.ids },
      successCallBack,
      errorCallBack
    );
  }else{
    SchedulerManagerService.getAllDevices(
      {},
      successCallBack,
      errorCallBack
    );
  }
}
 


export const getDeviceGroupByLocation=async(params,setIsLoading = () => {},)=>{
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {

    if(response?.result?.length>0){
      dispatch(setDeviceGroup(response?.result))
    }else{
      dispatch(setDeviceGroup([]))
    }
    setIsLoading(false);
   
  };

  const errorCallBack = (error) => {
     setIsLoading(false);
    if(error?.message){
      Alert.alert(error.message);
    }
  };

  SchedulerManagerService.getDeviceGroupListByLocations(
    { slugId,ids:params.ids },
    successCallBack,
    errorCallBack
  );
}
 

export const getLocationList =async(params,setIsLoading = () => {},)=>{
  const slugId = await getStorageForKey("slugId");

  setIsLoading(true);
  const successCallBack = async (response) => {
    if(response?.data?.hierarchy){
     dispatch(setLocationList(response?.data?.hierarchy))
    }
    setIsLoading(false);
  
  };

  const errorCallBack = (error) => {
   
    setIsLoading(false);
    if(error?.message){
      Alert.alert(error.message);
    }
  };

  SchedulerManagerService.fetchLocationList(
    { slugId },
    successCallBack,
    errorCallBack
  );
}
