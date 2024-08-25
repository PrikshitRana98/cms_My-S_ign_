import { Alert } from "react-native";
import Store from "../../appConfig/Redux/store";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { updateCampaingnArchiveList, updateCampaingnList } from "../../appConfig/Redux/Action/campaignAction";
import { AxiosService, baseUrl } from "../../Services/AxiosService/axios";
import { updateMediaLib } from "../../appConfig/Redux/Action/mediaLibAction";
import { updateTemplates } from "../../appConfig/Redux/Action/templateManagerAction";

const { dispatch } = Store;

const createQueryParamString = async (arr) => {
  const params = arr
    .map((item) => {
      if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
        const key = item.key;
        const value = item.value;
        return value.length ? `${key}=${value}` : '';
      } else {
        console.error('Invalid item:', item);
        return '';
      }
    })
    .filter((param) => param !== '');
  return await params.join('&');
}






export const getCampaignData = async (setIsLoading = () => { }, params, q, search = '') => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  // //service-gateway/cms/${params.slugId}/v1/campaign/
  const successCallBack = async (response) => {
    console.log('responseSuccess', response)
    dispatch(updateCampaingnList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (response) => {
    console.log('responseError', response)
    setIsLoading(false);
  };

  CampaignManagerService.fetchCampaignList(
    { slugId },
    successCallBack,
    errorCallBack
  );
};

export const getCampaignSearchData = async (setIsLoading = () => { }, params, searchArr, search = '') => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  let newParams = await createQueryParamString(searchArr)

  // //service-gateway/cms/${params.slugId}/v1/campaign/
  let nUrl = `${search}?${newParams}&pageNumber=${params.page}&pageSize=${params.pageSize}`

  //&pageNumber=${params.page}&pageSize=${params.pageSize}
  console.log('paramsparams>>>::::', params, searchArr)

  const successCallBack = async (response) => {
    console.log('responseSuccess', response)
    dispatch(updateCampaingnList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const errorCallBack = (response) => {
    console.log('responseError', response)
    setIsLoading(false);
  };

  CampaignManagerService.fetchCampaignSearchList(
    { ...params, slugId, url: nUrl },
    successCallBack,
    errorCallBack
  );
};

export const getCampaignPageData = async (setIsLoading = () => { }, params, q, search = '') => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  let nUrl = `search?pageNumber=${params.page}&pageSize=${params.pageSize}`;

  const successCallBack = async (response) => {
    console.log('responseSuccess', response)
    dispatch(updateCampaingnList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (response) => {
    console.log('responseError', response)
    setIsLoading(false);
  };

  CampaignManagerService.fetchCampaignPageList(
    { ...params, slugId, url: nUrl },
    successCallBack,
    errorCallBack
  );
};

export const getCampaignArchiveData = async (setIsLoading = () => { }) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  const successCallBack = async (response) => {
    console.log('responseCampaignArchiveSuccess', response)
    dispatch(updateCampaingnArchiveList(response?.data));
    setIsLoading(false);
  };

  const errorCallBack = (response) => {
    console.log('responseCampaignArchiveError', response)
    setIsLoading(false);
  };

  CampaignManagerService.fetchCampaignArchiveList(
    { slugId },
    successCallBack,
    errorCallBack
  );
};


export const getCmpData = async (endPoint,setIsLoading = () => {}) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);

  const successCallBack = async (response) => {
    dispatch(updateCampaingnList(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const errorCallBack = (response) => {
    console.log('getCmpData error-->', response)
    setIsLoading(false);
  };

  CampaignManagerService.ftchCampdata(
    { slugId,endPoint },
    successCallBack,
    errorCallBack
  );
};

export const CampaignManagerService = {
  ftchCampdata: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', params.endPoint, {}, {}, success, failure, 'Loading');
  },
  fetchCampaignList: (params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/campaign/search?pageNumber=${1}&pageSize=${30}`, {}, {}, success, failure, 'Loading');
  },
  fetchCampaignSearchList: (params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/campaign/${params.url}`, {}, {}, success, failure, 'Loading');
  },
  fetchCampaignPageList: (params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/campaign/${params.url}`, {}, {}, success, failure, 'Loading');
  },
  fetchCampaignArchiveList: (params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/campaign/archive`, {}, {}, success, failure, 'Loading');
  },
  DeleteCampaign: (params = {}, success = () => { }, failure = () => { }) => {
    let data = {
      ids:params.ids
    }
    console.log('params delete',params)
    AxiosService('DELETE', `service-gateway/cms/${params.slugId}/v1/campaign/`, data, {}, success, failure, 'Loading');
  },
  cloneCampaign: (params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('POST', `service-gateway/cms/${params.slugId}/v1/campaign/clone/${params.ids}`, params, {}, success, failure, 'Loading');
  },
  archiveCampaign: (params = {}, success = () => { }, failure = () => { }) => {
    let data = {
      ids:params.ids
    }
    AxiosService('POST', `service-gateway/cms/${params.slugId}/v1/campaign/archive`, data, {}, success, failure, 'Loading');
  },
  unArchiveCampaign: (params = {}, success = () => { }, failure = () => { }) => {
    let data = {
      ids:params.ids
    }
    AxiosService('POST', `service-gateway/cms/${params.slugId}/v1/campaign/unarchive`, data, {}, success, failure, 'Loading');
  },
  
  addAdvertisement: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparamsparams',params)
    AxiosService('POST', params.endPoint, params?.data, {}, success, failure, 'Loading');
  },
  editAdvertisement: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparamsparams',params)
    AxiosService('PUT', params.endPoint, params?.data, {}, success, failure, 'Loading');
  },
  addCampaign: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparamsparams',params)
    AxiosService('POST', `service-gateway/cms/${params.slugId}/v1/campaign`, params?.data, {}, success, failure, 'Loading');
  },
  editCampaign: (params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparamsparams==>put',params)
    AxiosService('PUT', `service-gateway/cms/${params.slugId}/v1/campaign/${params.campaignId}?submit-validations=false`, params?.data, {}, success, failure, 'Loading');
  },
  campaignSubmittedStatusAdd:(params = {}, success = () => {}, failure = () => {}) => {
    console.log('paramsparamsparams',params)
    AxiosService('POST', `service-gateway/cms/${params.slugId}/campaign/${params.campaignId}/submit`, params?.data, {}, success, failure, 'Loading');
  },
  fetchMediaList:(params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/media/search`, {}, {}, success, failure, 'Loading');
  },
  fetchTempleteList:(params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/template/filter`, {}, {}, success, failure, 'Loading');
  },
  getCmpaignDataCount:(params = {}, success = () => { }, failure = () => { }) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/countByState`, {}, {}, success, failure, 'Loading');
  },
  getArchiveData: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `service-gateway/cms/${params.slugId}/v1/campaign/search?pageNumber=1&noPerPage=10&isArchieved=true`, {}, {}, success, failure, 'Loading');
  },
  onApprove: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `service-gateway/cms/${params.slugId}/campaign/${params.campaignId}/approve`, {}, {}, success, failure, 'Loading');
  },
  onCancelApprove: (params = {}, success = () => {}, failure = () => {}) => {
    let data={comment: params?.reason}
    AxiosService('POST', `service-gateway/cms/${params.slugId}/campaign/${params.campaignId}/reject`, data, {}, success, failure, 'Loading');
  },
  editCmpLoc:async(params = {}, success = () => {}, failure = () => {})=>{
    const token = await getStorageForKey("authToken");
    const slugId = await getStorageForKey("slugId");
    const networkUrl =baseUrl + `service-gateway/cms/${params.slugId}/content-playlist/${params.campaignId}`;
    console.log("thisis netwo",networkUrl)
    console.log("bodyy---->yy",JSON.stringify(params.data))
    try{
       let options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:"Bearer " + token,
        },
        body: JSON.stringify(params.data),
        redirect: "follow",
      };
       fetch(networkUrl, options).then(async (response) => {
        const rs = await response.json();
        if (success) {
          success(rs);
          console.log("response of ",rs)
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
    }catch(error){

    }
    

  }
}



export const getMediaDataForCampAdd = async (setIsLoading = () => { }) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    
    dispatch(updateMediaLib(response));
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  const errorCallBack = (response) => {
    console.log('errorCallBack responseError', response)
    setIsLoading(false);
  };

  CampaignManagerService.fetchMediaList(
    { slugId },
    successCallBack,
    errorCallBack
  );
};

export const getTempleteDataForCampAdd = async (setIsLoading = () => { }) => {
  const slugId = await getStorageForKey("slugId");
  setIsLoading(true);
  const successCallBack = async (response) => {
    dispatch(updateTemplates(response?.data));
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  const errorCallBack = (response) => {
    console.log('errorCallBack responseError', response)
    
    setIsLoading(false);
  };

  CampaignManagerService.fetchTempleteList(
    { slugId },
    successCallBack,
    errorCallBack
  );
};