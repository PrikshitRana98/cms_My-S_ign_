import axios from 'axios';
import {AxiosService, baseUrl} from './axios';
import { getStorageForKey } from '../Storage/asyncStorage';

export const AuthenticationService = {

  login: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `oauth-server/customer/${params.slugName}/oauth/token?grant_type=password&username=${params.email}&password=${params.password}`, params, {}, success, failure, 'Loading');
  },
  
  forgetPassword: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `user-management/ums/${params.slugName}/password-forgot?email-type=forgot-password`, params, {}, success, failure, 'Loading');
  },

  fetchSlugName: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `tenant-management/tms/v1/customers/${params.CustomerId}`, params, {}, success, failure, 'Loading');
  },

  fetchCustomer: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService(
      'GET',
      '/dashboard/customer',
      params,
      {},
      success,
      failure,
      'Loading',
    );
  },
};

export const ResolutionManagerService = {
  fetchResolutionList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/aspect-ratio/`, {}, {}, success, failure, 'Loading');
  },
  createResolution: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}/v1/aspect-ratio/`, params, {}, success, failure, 'Loading');
  },
  calculateAspectRatio: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}/v1/aspect-ratio/calculate/`, params, {}, success, failure, 'Loading');
  },
  updateResolution: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('PUT', `content-management/cms/${params.slugId}/v1/aspect-ratio/${params.aspectRatioId}`, params, {}, success, failure, 'Loading');
  },
  DeleteResolution: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('DELETE', `content-management/cms/${params.slugId}/v1/aspect-ratio/${params.aspectRatioId}`, params, {}, success, failure, 'Loading');
  },
  BulkDeleteResolution: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('DELETE', `content-management/cms/${params.slugId}/v1/aspect-ratio/`, params, {}, success, failure, 'Loading');
  },
}

export const TemplateService = {
  fetchTemplateList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/template/filter?currentPage=${params.currentPage}&numPerPage=${params.numPerPage}`, {}, {}, success, failure, 'Loading');
  },
  fetchTemplateList2: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `${params}`, {}, {}, success, failure, 'Loading');
  },
  createTemplate: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}/v1/aspect-ratio/`, params, {}, success, failure, 'Loading');
  },
  updateTemplate: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('PUT', `content-management/cms/${params.slugId}/v1/aspect-ratio/${params.aspectRatioId}`, params, {}, success, failure, 'Loading');
  },
  DeleteTemplate: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('DELETE', `content-management/cms/${params.slugId}/v1/template/`, params, {}, success, failure, 'Loading');
  },
  BulkDeleteTemplate: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('DELETE', `content-management/cms/${params.slugId}/v1/aspect-ratio/`, params, {}, success, failure, 'Loading');
  },
}
 
export const MediaLibraryService = {
  fetchMediaLibList: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}${params.url}`, {}, {}, success, failure, 'Loading');
  },
  getArchiveMedia:(params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}${params.url}`, {}, {}, success, failure, 'Loading')
  },
  UploadMediafileLib: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}//v1/media/file`, params, {}, success, failure, 'Loading');
  },
  uploadMediaLibApi: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}/v1/media`, params, {}, success, failure, 'Loading');
  },

  getWidgetTypes: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/media/`, params, {}, success, failure, 'Loading');
  },
  
  DeleteMediaLib: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('DELETE', `content-management/cms/${params.slugId}/v1/media/`, params, {}, success, failure, 'Loading');
  },
  ChangeToArchive: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('POST', `content-management/cms/${params.slugId}/v1/media/${params.url}`, params, {}, success, failure, 'Loading');
  },

  updateMediaViaContentApi:(params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('PUT', `content-management/cms/${params.slugId}/v1/media/${params.mediaDetailId}`, params, {}, success, failure, 'Loading')
  },

  getMediaContentApi:(params = {}, success = () => {}, failure = () => {}) => {
    AxiosService('GET', `content-management/cms/${params.slugId}/v1/media/${params.mediaDetailId}`, {}, {}, success, failure, 'Loading')
  },
  

}



export const NotificationApiService = {
  getNotifications: async(params = {}, success = () => {}, failure = () => {}) => {
        const token = await getStorageForKey('authToken');
        const newUrl=baseUrl+params.endPoint;
        const authHeader = {
          Authorization:  'Bearer ' + token,
          "Content-Type": "application/json",
          "Accept": "application/json",
          // "X-Tenant-Id": slugId,
        };
        await axios.get(newUrl,{headers: authHeader})
        .then(response => {
          if (success && response.status === 200) {
            success(response?.data);
          }
        })
        .catch(error => {
          failure(error);
          })
        .finally(() => {
          console.log(' ');
        });
        
  },
  markRead: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("PUT", params.endPoint, params.params, {}, success, failure, "Loading");
  },
    
  
}

export const ChangePasswordApiService = {
  
  changePwd: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("PUT", params.endPoint, params.params, {}, success, failure, "Loading");
},
  

}

export const CommonService = {
  getWorkFlow: (params = {}, success = () => {}, failure = () => {}) => {
    AxiosService("GET", `service-gateway/ums/${params.slugId}/v1/customer/work-flow`, params.params, {}, success, failure, "Loading");
  },
  checkIsApprover:(params = {}, success = () => {}, failure = () => {})=>{
    AxiosService("GET", `user-management/ums/${params.slugId}/v1/customer/work-flow`, params.params, {}, success, failure, "Loading");
  },
  getCustomerRole:(params = {}, success = () => {}, failure = () => {})=>{
    AxiosService("GET", `user-management/ums/${params.slugId}/v1/user/profile`, params.params, {}, success, failure, "Loading");
  }
}

