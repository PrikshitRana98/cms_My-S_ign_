import {
  DISABLE_LOADER,
  ENABLE_LOADER,
  UPDATE_USER,
  GET_LOCATION_LIST,
  GET_DEVICE_GROUP,
  GET_DEVICE
} from '../ActionTypes/commonActionTypes';

const initialState = {
  userDetails: {},
  appLoader: false,
  resolutionList: [],
  locationData:null,
  deviceGroupData:null,
  deviceData:null
};
const CommonReducer = (state = initialState, action) => {


  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        userDetails: action.payload,
      };
    case ENABLE_LOADER:
      return {
        ...state,
        appLoader: true,
      };
    case DISABLE_LOADER:
      return {
        ...state,
        appLoader: false,
      };
    case GET_LOCATION_LIST:
      return {
        ...state,
        locationData: action.payload,
      };
    case GET_DEVICE_GROUP:
      return {
        ...state,
        deviceGroupData: action.payload,
      };
    case GET_DEVICE:
      return {
        ...state,
        deviceData: action.payload,
      };
    default:
      return state;
  }
};
export default CommonReducer;
