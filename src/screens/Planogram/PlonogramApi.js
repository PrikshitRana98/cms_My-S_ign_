import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import {
  getStorageForKey,
  removeKeyInStorage,
  setStorageForKey,
} from "../../Services/Storage/asyncStorage";
import {
  updateCampaingnArchiveList,
  updateCampaingnList,
} from "../../appConfig/Redux/Action/campaignAction";
import { AxiosService } from "../../Services/AxiosService/axios";
import { updateMediaLib } from "../../appConfig/Redux/Action/mediaLibAction";
import { updateTemplates } from "../../appConfig/Redux/Action/templateManagerAction";
import { updatePlonogramList } from "../../appConfig/Redux/Action/plonogramAction";
import {
  setDevice,
  setDeviceGroup,
  setLocationList,
} from "../../appConfig/Redux/Action/commonAction";
import { ASYNC_STORAGE } from "../../Constants/asyncConstants";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { useNavigation } from "@react-navigation/native";

const { dispatch } = Store;


const logout = async (navigation) => {
  
  await removeKeyInStorage(ASYNC_STORAGE.USER_DETAILS);
  await setStorageForKey(ASYNC_STORAGE.LOGGED, false);
  await removeKeyInStorage("slugId")
  await removeKeyInStorage("is_scheduler_enabled");
  await removeKeyInStorage("authorities")
  await removeKeyInStorage("authToken")
  await removeKeyInStorage("userDetails")
  await removeKeyInStorage("fcmToken");
  navigation.reset({
    index: 0,
    routes: [{ name: NAVIGATION_CONSTANTS.LOGIN }],
  });
  try {
    // await AsyncStorage.clear();
    console.log("Storage cleared successfully");
  } catch (error) {
    console.log("Error clearing storage:", error);
  }
};

export const getPlonogramData = async (
  endPoint,
  setIsLoading = () => {},
  navigation,
  params,
  q,
  search = ""
) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    // console.log(" getPlonogramData responseSuccess123456-----", response.data.length);
    dispatch(updatePlonogramList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (error) => {
    setIsLoading(false);
    console.log("responseError getPlonogramData", error);
    if (error?.response?.data) {
      if (error.response.data.name == "UnAuthorized") {
        Alert.alert("Unauthorized", error.response.data?.message, [
          {
            text: "Ok",
            onPress: () => {
              logout(navigation);
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      }
    } else if (error?.message) {
      Alert.alert(error.message);
    }
  };

  PlanogramManagerService.fetchPlonogramList(
    { slugId, endPoint },
    successCallBack,
    errorCallBack
  );
};

export const getLocationList = async (params, setIsLoading = () => {}) => {
  const slugId = await getStorageForKey("slugId");
  console.log("slugId", slugId);
  const successCallBack = async (response) => {
    if (response?.data?.hierarchy) {
      dispatch(setLocationList(response?.data?.hierarchy));
    }

    // console.log("getLocationList success-----", response?.code, response?.data?.hierarchy);
  };

  const errorCallBack = (error) => {
    console.log("getLocationList Error", error);

    if (error?.message) {
      Alert.alert("Something went wrong.Please try later.");
    }
  };

  PlanogramManagerService.fetchLocationList(
    { slugId },
    successCallBack,
    errorCallBack
  );
};

export const getDeviceByLocation = async (params, setIsLoading = () => {}) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    // console.log("getDeviceByLocation success-----",JSON.stringify(response.result), response.result.length);
    if (params.ids.length > 0) {
      if (response?.result?.length > 0) {
        dispatch(setDevice(response?.result));
      } else {
        dispatch(setDevice([]));
      }
    } else {
      if (response?.content?.length > 0) {
        dispatch(setDevice(response?.content));
      } else {
        dispatch(setDevice([]));
      }
    }
    setIsLoading(false);
  };

  const errorCallBack = (error) => {
    console.log("getDeviceByLocation Error", error);
    setIsLoading(false);
    if (error?.message) {
      Alert.alert(error.message);
    }
  };
  console.log("params.ids.length",params.ids.length)
  if (params.ids.length > 0) {
    PlanogramManagerService.getDeviceListByLocations(
      { slugId, ids: params.ids },
      successCallBack,
      errorCallBack
    );
  } else {
    PlanogramManagerService.getAllDevices({}, successCallBack, errorCallBack);
  }
};

export const getDeviceGroupByLocation = async (
  params,
  setIsLoading = () => {}
) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    if (response?.result?.length > 0) {
      dispatch(setDeviceGroup(response?.result));
    } else {
      dispatch(setDeviceGroup([]));
    }
    setIsLoading(false);
    
  };

  const errorCallBack = (error) => {
    console.log("getDeviceGroupByLocation Error", error);
    setIsLoading(false);
    if (error?.message) {
      Alert.alert(error.message);
    }
  };

  PlanogramManagerService.getDeviceGroupListByLocations(
    { slugId, ids: params.ids },
    successCallBack,
    errorCallBack
  );
};

export const PlanogramManagerService = {
  fetchDeviceLogicList: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params?.slugId}/planogram/device-logic/${params?.planogramID}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  fetchLocationList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `location-management/lcms/${params.slugId}/v1/location-hierarchy/user-access-devices`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  fetchPlonogramList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", params.endPoint, {}, {}, success, failure, "Loading");
  },
  fetchByIdPlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params", params);
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/${params.planogramId}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  fetchPlangogramPriorityList: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params", params);
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram?sort-by-priority=asc`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  locationList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `location-management/lcms/protons/v1/location/all-location`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },

  deletePlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params.ids);
    let data = {
      ids: params.ids,
    };
    AxiosService(
      "DELETE",
      `service-gateway/cms/${params.slugId}/planogram`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  addPlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params);
    let data = params.data;
    AxiosService(
      "POST",
      `service-gateway/cms/${params.slugId}/planogram/schedule`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  addPlanogramPriority: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params.ids", params);
    let data = { planogramPriorities: params.postData };
    AxiosService(
      "PUT",
      `service-gateway/cms/${params.slugId}/planogram/priorities`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },

  addSubmitStatus: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params);
    let data = params.data;
    AxiosService(
      "POST",
      `service-gateway/cms/${params.slugId}/planogram/${params.planogramID}/submit`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getDeviceGroupList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `device-management/api/deviceGroup`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  getDeviceGroupListByLocations: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    let ids = "";
    if (params.ids.length > 0) {
      params.ids?.map((item) => {
        if (ids == "") {
          ids = `locationIds=${item}`;
        } else {
          ids = ids + `&locationIds=${item}`;
        }
      });
    }
    console.log("getDeviceGroupListByLocations ids", ids);
    AxiosService(
      "GET",
      `device-management/api/deviceGroup/planogram?${ids}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  getAllDevices: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("getAllBySearchCriteria--> planogram",JSON.stringify(params))
    AxiosService(
      "POST",
      `device-management/api/device/getAllBySearchCriteria`,
      params,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getDeviceListByLocations: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    let ids = "";
    if (params.ids.length > 0) {
      params.ids?.map((item) => {
        if (ids == "") {
          ids = `locationIds=${item}`;
        } else {
          ids = ids + `&locationIds=${item}`;
        }
      });
    }
    console.log("getDeviceGroupListByLocations ids", ids);
    AxiosService(
      "GET",
      `device-management/api/device/planogram?${ids}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  updateDeviceLogicPlanogram: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params.ids", params);
    AxiosService(
      "PUT",
      `service-gateway/cms/${params.slugId}/planogram/device-logic/${params.planogramId}/${params.deviceLogicId}`,
      params.postData,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getCampaignStringByAspectRatio: (
    aspectRatioId,
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/campaignString/?aspectRatioId=${aspectRatioId}&state=SUBMITTED,PUBLISHED,APPROVED&name=`,
      params,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getCampaignByAspectRatio: (
    aspectRatioId,
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("aspectRatioId-------", aspectRatioId);
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/v1/campaign/search?aspectRatioId=${aspectRatioId}&state=SUBMITTED,PUBLISHED&campaignName=`,
      params,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getCampaignByAspectRatio1: (
    aspectRatioId,
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("aspectRatioId-------", aspectRatioId);
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/v1/campaign/search?aspectRatioId=${aspectRatioId}&state=SUBMITTED,PUBLISHED,APPROVED&campaignName=`,
      params,
      {},
      success,
      failure,
      "Loading"
    );
  },
  updateCampaigCampaigStringPlanogram: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params.ids", params);
    AxiosService(
      "PUT",
      `service-gateway/cms/${params.slugId}/planogram/campaign-and-campaign-strings/${params.planogramId}`,
      params.postData,
      {},
      success,
      failure,
      "Loading"
    );
  },

  editPlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "PUT",
      `service-gateway/cms/${params.slugId}/planogram/schedule/${params.planogramId}`,
      params.data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  getPlanogramDetail: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/${params.planogramId}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  ratioIdString: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params.ids);

    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/v1/aspect-ratio/${params.ids}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  deviceList: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params.ids);

    AxiosService(
      "GET",
      `service-gateway/cms/${params.slugId}/planogram/${params.ids}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  deleteCampaignString: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params.ids", params.ids);
    let data = {
      ids: params.ids,
    };
    AxiosService(
      "DELETE",
      `service-gateway/cms/${params.slugId}/planogram`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  clonePlanogramString: (
    params = {},
    success = () => {},
    failure = () => {}
  ) => {
    console.log("params.ids", params.ids);

    let data = params.ids;
    AxiosService(
      "POST",
      `service-gateway/cms/${params.slugId}/planogram/clone/${data}`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  stopPlanogram: (params = {}, success = () => {}, failure = () => {}) => {
    console.log("params.ids", params);

    AxiosService(
      "PUT",
      `service-gateway/cms/${params.slugId}/planogram/stop`,
      params.data,
      {},
      success,
      failure,
      "Loading"
    );
  },
  onApprove: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "POST",
      `service-gateway/cms/${params.slugId}/planogram/${params.planogramId}/approve`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
  },
  onCancelApprove: (params = {}, success = () => {}, failure = () => {}) => {
    let data = { comment: params?.reason };
    AxiosService(
      "POST",
      `service-gateway/cms/${params.slugId}/planogram/${params.planogramId}/reject`,
      data,
      {},
      success,
      failure,
      "Loading"
    );
  },
};
