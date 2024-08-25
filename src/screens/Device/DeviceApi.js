import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { AxiosService, baseUrl } from "../../Services/AxiosService/axios";
import { updateRegisterDeviceList } from "../../appConfig/Redux/Action/deviceAction";
import axios from "axios";

const { dispatch } = Store;

 

export const getRegisterMedia = async (endPoint,setIsLoading = () => {}) => {
  setIsLoading(true);
  const successCallBack = async (response) => {
    console.log('getRegisterMedia success', response)
    dispatch(updateRegisterDeviceList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (response) => {
    console.log('getRegisterMedia error', response)
    setIsLoading(false);
  };

  deviceManagerService.fetchRegisterMedia(
    { endPoint },
    successCallBack,
    errorCallBack
  );
};
export const getDeviceByLocation = async (params,setIsLoading = () => {}) => {
  setIsLoading(true);
  const successCallBack = async (response) => {
    console.log('getDeviceByLocation success', response)
    dispatch(updateRegisterDeviceList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (response) => {
    console.log('getDeviceByLocation error', response)
    setIsLoading(false);
  };
  let endPoint = `device-management/api/device/planogram?locationIds=${params}`
  deviceManagerService.fetchDeviceByLocation(
    { endPoint },
    successCallBack,
    errorCallBack
  );
};

export const AddDevicefun=async(params = {}, success = () => {}, failure = () => {})=>{
  const networkUrl = baseUrl + 'device-management/api/device';

  const token = await getStorageForKey("authToken");
  const slugId = await getStorageForKey("slugId");

  const authHeader = {
    Authorization:"Bearer " + token,
    "Content-Type": "application/json",
    // "X-Tenant-Id": slugId,
  };


  
  try{
    await axios.post(networkUrl,params,{headers:authHeader})
    .then((response)=>success(response.data))
  }catch(error){
    failure(error)
  }
}



export const deviceManagerService = {
  fetchUnRegisterMedia:(params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",params.endPoint,{},{},success,failure,"Loading");
  },
  fetchRegisterMedia:(params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",params.endPoint,{},{},success,failure,"Loading");
  },
  fetchUserList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`tenant-management/tms/v1/customer/${params.slugId}`,{},
      {},success,failure,"Loading");
  },
  addDevice:(params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `device-management/api/device`, params, {}, success, failure, 'Loading');
  },
  addPanelsToDevice:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('params',params)
    AxiosService('PUT', `device-management/api/panel`, params, {}, success, failure, 'Loading');
  },
  editDevice:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('Edit device params', params)
    AxiosService('PUT', `device-management/api/device/${params.deviceId}`, params.postData, {}, success, failure, 'Loading');
  },
  editUnRegDevice:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('Edit device params', params)
    AxiosService('POST', `device-management/api/device`, params.postData, {}, success, failure, 'Loading');
  },
  replaceDevice:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('Edit device params', params)
    AxiosService('PUT', `device-management/api/device/replace`, params.postData, {}, success, failure, 'Loading');
  },
  deletDevice :(params = {}, success = () => {}, failure = () => {}) => {
    console.log('delet device params', params)
    AxiosService('PUT', `device-management/api/device/status`, params, {}, success, failure, 'Loading');
  },
  actionOnDevice :(params = {}, success = () => {}, failure = () => {}) => {
    console.log('delet device params', params)
    AxiosService('PUT', `device-management/api/device/status`, params, {}, success, failure, 'Loading');
  },
  getDownloadLinks: (params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",`service-gateway/cms/${params.slugId}/download-all?start-date=${params.startDate}&end-date=${params.endDate}&device-ids=${params.deviceID}`,{},{},success,failure,"Loading");
  },
  getDownload: (params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",params.url,{},{},success,failure,"Loading");
  },
  offOnNoti: (params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("POST",`device-management/api/push/devices/messages`,params,{},success,failure,"Loading");
  },
  fetchDeviceByLocation:(params, success = () => {}, failure = () => {})=>{ 
    console.log("fetchDeviceByLocation",params)
    let endPoint=`device-management/api/device/planogram?locationIds=${params}`;
    if(!params){
      endPoint=`device-management/api/device/planogram?locationIds=`;
    }
    AxiosService("GET",endPoint,{},{},success,failure,"Loading");
  },
  getAllDevicesByLocation:(params = {}, success = () => {}, failure = () => {})=>{
    AxiosService("GET",`device-management/api/device/planogram${params.ids}`,{}, {},success,failure,"Loading");
  },
  fetchPlanogramByDates:(params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",`service-gateway/cms/${params.slugId}/planogram/device/${params.deviceId}?start-date=${params.startDate}&end-date=${params.endDate}`,{},{},success,failure,"Loading");
  },
  getDeviceDetails:(params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("GET",`device-management/api/device?deviceIds=${params.deviceId}`,{},{},success,failure,"Loading");
  },
  downloadDevicelog:(params = {}, success = () => {}, failure = () => {})=>{ 
    AxiosService("POST",`device-management/api/devices/messages`,{params},{},success,failure,"Loading");
  },

//   http://k8s-nn-ingressp-e1098695e7-209877555.ap-south-1.elb.amazonaws.com/device-management/api/push/devices/messages
// Request Method:
// POST
};
