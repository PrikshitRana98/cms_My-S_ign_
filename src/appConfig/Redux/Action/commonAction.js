import {UPDATE_USER, ENABLE_LOADER, DISABLE_LOADER,GET_LOCATION_LIST,GET_DEVICE_GROUP,GET_DEVICE} from '../ActionTypes/commonActionTypes';

export const updateUserDetails = data => ({
  type: UPDATE_USER,
  payload: data,
});
export const enableLoader = () => ({
  type: ENABLE_LOADER,
});
export const disableLoader = () => ({
  type: DISABLE_LOADER,
});

export const setLocationList = data => ({
  type: GET_LOCATION_LIST,
  payload: data,
});
export const setDeviceGroup = data => ({
  type: GET_DEVICE_GROUP,
  payload: data,
});
export const setDevice = data => ({
  type: GET_DEVICE,
  payload: data,
});
