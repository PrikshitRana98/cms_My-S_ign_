import { AxiosService } from "../../Services/AxiosService/axios";

export const AboutService = {
    getAboutData: (params = {}, success = () => {}, failure = () => {}) => {
      AxiosService("GET", 
      `tenant-management/get/1`, 
      {}, {}, 
      success, failure, "Loading");
    },
}