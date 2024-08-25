import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { AxiosService } from "../../Services/AxiosService/axios";
import { updateActiveList, updateActiveSideCount, updateRecentMediaUpload, updateUserList } from "../../appConfig/Redux/Action/userAction";
import { setDevice, setDeviceGroup, setLocationList } from "../../appConfig/Redux/Action/commonAction";
const { dispatch } = Store;

export const getUserData = async (
  params,
  setIsLoading = () => {},
) => {
  setIsLoading(true);
  const successCallBack = async (response) => {
    dispatch(updateUserList(response));
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const errorCallBack = (error) => {
    console.log("error in userManagerService.fetchUserList--->",JSON.stringify(error.response.data))
    console.log("line 24 dashapi",error.message)
    if(error?.response?.data?.message){
      Alert.alert("Error","Something went wrong.Please try later")
    }else{
      // Alert.alert("Error",error.message)
      Alert.alert("Error","Something went wrong.Please try later")
    }
    setIsLoading(false);
  };

  userManagerService.fetchUserList(
    params ,
    successCallBack,
    errorCallBack
  );
};
export const getActiveSiteData = async (
    params,
    setIsLoading = () => {},
  ) => {
    setIsLoading(true);
    const successCallBack = async (response) => {
      
      dispatch(updateActiveSideCount(response?.data));
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };
  
    const errorCallBack = (response) => {
      setIsLoading(false);
      console.log("line 55 dashapi",error.message)
      
    };
  
    userManagerService.fetchActiveSiteList(
      params ,
      successCallBack,
      errorCallBack
    );
  };

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
      console.log("getAllDevices",error?.message)
      console.log("line 90dashapi",error.message)
      setIsLoading(false);
      if(error?.message!="JSON Parse error: Unexpected end of input"){
        // Alert.alert(error.message);
        
      }
    };
    if(params.ids.length>0){
      userManagerService.getDeviceListByLocations(
        { slugId,ids:params.ids },
        successCallBack,
        errorCallBack
      );
    }else{
      userManagerService.getAllDevices(
        {},
        successCallBack,
        errorCallBack
      );
    }
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
        Alert.alert("Something went worng.");
        console.log("line 129 dashapi",error.message)
      }
    };
  
    userManagerService.fetchLocationList(
      { slugId },
      successCallBack,
      errorCallBack
    );
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
        // Alert.alert(error.message);
        console.log("line 152 dashapi",error.message)
      }
    };
  
    userManagerService.getDeviceGroupListByLocations(
      { slugId,ids:params.ids },
      successCallBack,
      errorCallBack
    );
  }
   
  
  export const getRecentMediaData = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      
      if (response) {
        updateRecentMediaUpload(response)
      }
    };
    const failureCallBack = (error) => {
      console.log("Error Recent Media Data", error);
      console.log("line 184 dashapi",error.message)
    };
    userManagerService.recentMediaList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

export const userManagerService = {
  recentMediaList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/recent-media?currPage=${params?.currentPage}&numPerPage=${params?.limit}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentCampaignStringList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/v1/campaignString/recent-campaign-strings?currPage=${params?.currentPage}&numPerPage=${params?.limit}&dashboard=true`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  fetchLocationList: (params = {}, success = () => {}, failure = () => {}) => {

    AxiosService("GET", `location-management/lcms/${params.slugId}/v1/location-hierarchy`, {}, {}, success, failure, "Loading");
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
  getAllDevices:(params = {}, success = () => {}, failure = () => {})=>{
    console.log("params---getAllDevices-->",JSON.stringify(params))
    AxiosService("POST",`device-management/api/device/getAllBySearchCriteria`,params, {},success,failure,"Loading");
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
  recentScheduler: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `capsuling-service/api/capsuling/recent-schedulers?currentPage=${params?.currentPage}&noPerPage=${params?.limit}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentPlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/recent-planograms?currentPage=${params?.currentPage}&noPerPage=${params?.limit}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentCamapignList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/v1/campaign/recent-campaign-added?currPage=${params?.currentPage}&numPerPage=${params?.limit}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentDevices: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `device-management/api/device/recent-devices?currentPage=${params?.currentPage}&noPerPage=${params?.limit}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentInactiveDevices: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`device-management/api/device/recent-inactive-devices?currentPage=${params?.currentPage}&noPerPage=${params?.limit}`,{},{},success,failure,"Loading");
  },
  fetchUserList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `tenant-management/tms/v1/customer/${params.slugId}`, {}, {}, success, failure, "Loading");
  },
  fetchUserDetails: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `service-gateway/ums/${params.slugId}/v1/license/customer?apiKey=India@123`, {}, {}, success, failure, "Loading");
  },
  
  fetchActiveSiteList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `location-management/lcms/${params.slugId}/v1/active-sites`, {}, {}, success, failure, "Loading");
  },

  
  recentInActiveList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  



 


  recentPublishedList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentPlanogarmRunningList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentPlanogarmRunningListSch: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `capsuling-service/api/capsuling/recent-published-scheduler-and-playing-right-now`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentPlanogramLiveListSch: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `capsuling-service/api/capsuling/recent-published-scheduler-but-not-running`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  recentPlanogramLiveList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/recent-published-planograms-but-not-running`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  fetchMediaPlayer: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `device-management/api/device/device-count-group-for-dashboard?locationIds=${params.locationId}`, {}, {}, success, failure, "Loading");
  },
  fetchConnectedDisconnectedDevices: (params = {}, success = () => {}, failure = () => {}) => {
    // device-management/api/reports/deviceConnectedDisconncted?locationIds=110
    AxiosService("GET", `device-management/api/reports/deviceConnectedDisconnected?locationIds=${params.locationId}`, {}, {}, success, failure, "Loading");
  },
  fetchUnApprovalPlano: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `service-gateway/cms/${params?.slugId}/planogram/v1/waiting-for-approval`, {}, {}, success, failure, "Loading");
  },
  fetchUnApprovalPlanoSch: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `capsuling-service/api/capsuling/v1/waiting-for-approval`, {}, {}, success, failure, "Loading");
  },
  fetchApprovedRejectedPlano: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `service-gateway/cms/${params?.slugId}/planogram/v1/dashboard/recent-approved-rejected-planograms`, {}, {}, success, failure, "Loading");
  },
  fetchApprovedRejectedPlanoSch: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `capsuling-service/api/capsuling/v1/dashboard/recent-approved-rejected-planograms`, {}, {}, success, failure, "Loading");
  },
  
};
