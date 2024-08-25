import {
  RESET,
    UPDATE_REGISTER_DEVICE_LIST
} from "../ActionTypes/commonActionTypes";

export const resetDeviceReducer = (data = []) => ({
  type: RESET,
  payload: [],
});

export const updateRegisterDeviceList = (data = {}) => ({
  type: UPDATE_REGISTER_DEVICE_LIST,
  payload: data,
});


