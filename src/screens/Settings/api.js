import { AxiosService } from "../../Services/AxiosService/axios";

export const TermService = {
    getTC: (params = {}, success = () => {}, failure = () => {}) => {
      AxiosService("GETWIHOUTTOKEN", 
      `tenant-management/in/business/about-digital-signage-service-support-why-panasonic/digital-signage-software3.0_eula_.html`, 
      {}, {}, 
      success, failure, "Loading");
    },
    setTC:(params = {}, success = () => {}, failure = () => {}) => {
      AxiosService("PUT", 
      `tenant-management/save/terms/1`, 
      params, {}, 
      success, failure, "Loading");
    },
}

export const Policyervice = {
    getPolicy: (params = {}, success = () => {}, failure = () => {}) => {
      AxiosService("GETWIHOUTTOKEN", 
      `tenant-management/get/policy/1`, 
      {}, {}, 
      success, failure, "Loading");
    },
}

export const ThirdPartyService = {
    getthirdParty: (params = {}, success = () => {}, failure = () => {}) => {
      AxiosService("GETWIHOUTTOKEN", 
      `tenant-management/in/business/about-digital-signage-service-support-why-panasonic/digital-signage-software3.0_oss_.html`, 
      {}, {}, 
      success, failure, "Loading");
    },
}