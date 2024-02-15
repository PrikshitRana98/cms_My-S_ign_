import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { AxiosService } from "../../Services/AxiosService/axios";
import { updateActiveList, updateActiveSideCount, updateRecentMediaUpload, updateUserList } from "../../appConfig/Redux/Action/userAction";

const { dispatch } = Store;

export const getUserData = async (
  params,
  setIsLoading = () => {},
) => {
  setIsLoading(true);
  const successCallBack = async (response) => {
    dispatch(updateUserList(response));
    console.log("updateUserList Dashboard",JSON.stringify(response))
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const errorCallBack = (error) => {
    console.log("error in userManagerService.fetchUserList",JSON.stringify(error))
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
    };
  
    userManagerService.fetchActiveSiteList(
      params ,
      successCallBack,
      errorCallBack
    );
  };


  
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
      `content-management/cms/${params.slugId}/recent-media?currPage=${params?.currentPage}&numPerPage=${params?.limit}`,
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
      `content-management/cms/${params.slugId}/v1/campaignString/recent-campaign-strings?currPage=${params?.currentPage}&numPerPage=${params?.limit}&dashboard=true`,
      {},
      {},
      success,
      failure,
      "Loading"
    );
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
      `content-management/cms/veer/planogram/recent-planograms?currentPage=${params?.currentPage}&noPerPage=${params?.limit}`,
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
      `content-management/cms/${params.slugId}/v1/campaign/recent-campaign-added?currPage=${params?.currentPage}&numPerPage=${params?.limit}`,
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
  
  fetchActiveSiteList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `location-management/lcms/${params.slugId}/v1/active-sites`, {}, {}, success, failure, "Loading");
  },

  
  recentInActiveList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      "GET",
      `content-management/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
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
      `content-management/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
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
      `content-management/cms/${params.slugId}/planogram/recent-published-planograms-and-playing-right-now`,
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
      `content-management/cms/${params.slugId}/planogram/recent-published-planograms-but-not-running`,
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
