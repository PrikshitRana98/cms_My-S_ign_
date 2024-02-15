import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { AxiosService } from "../../Services/AxiosService/axios";
import {
  updateActiveList,
  updateRecentMediaUpload,
  updateUserList,
} from "../../appConfig/Redux/Action/userAction";

const { dispatch } = Store;


export const mediaGroupManagerService = {
  fetchMediaGroupList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`device-management/api/deviceGroup`,{},
      {},success,failure,"Loading");
  },
  fetchMediaByGroupList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`device-management/api/devicesByGroup`,{},
      {},success,failure,"Loading");
  },
  addMPGroup: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("POST",`device-management/api/deviceGroup`,params,
      {},success,failure,"Loading");
  },
  editMPGroup: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("PUT",`device-management/api/deviceGroup`,params,
      {},success,failure,"Loading");
  },
  deleteMPData: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('params',params)
    AxiosService("DELETE",`device-management/api/deviceGroup`,params,
      {},success,failure,"Loading");
  },
  deleteMPDataMulti: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('params',params)
    AxiosService("DELETE",`device-management/api/deleteDeviceGroups`,params,
      {},success,failure,"Loading");
  },
  fetchAssignUnAssignMpDevicesList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`device-management/api/devicesByGroup`,{},{},success,failure,"Loading");
  },
  fetchDvicesListByLocation: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET",`device-management/api/device/ungrouped?location-ids=${params.locationIds}`,{},{},success,failure,"Loading");
  },
  moveAssignToUnassign: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('deleteAssignToUn')
    AxiosService("DELETE",`device-management/api/assign-devices/${params?.deviceGroupId}`,params,{},success,failure,"Loading");
  },
  moveUnassignToAssign: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("PUT",`device-management/api/assign-devices/${params?.deviceGroupId}`,params,{},success,failure,"Loading");
  },

};
