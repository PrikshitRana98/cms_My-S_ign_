import {
  GET_ACTIVE_DATA,
  GET_USER_DATA,
  SET_CUSTOMER_INFO,
  SET_CUSTOMER_ROLE,
  SET_IS_SCHEDULER_ENABLED,
  SET_RECENT_MEDIA_UPLOAD,
  SET_USER_AUTHORIZATIONS,
  UPDATE_ACTIVE_SIDE_COUNT,
  UPDATE_DRAWER_INDEX,
  UPDATE_IS_APPROVER,
  UPDATE_USER_WORK_FLOW,
} from "../ActionTypes/commonActionTypes";

export const updateUserList = (data = []) => ({
  type: GET_USER_DATA,
  payload: data,
});
export const updateActiveList = (data = []) => ({
  type: GET_ACTIVE_DATA,
  payload: data,
});
export const updateRecentMediaUpload = (data) => ({
  type: SET_RECENT_MEDIA_UPLOAD,
  payload: data,
});
export const updateActiveSideCount = (data = {}) => ({
  type: UPDATE_ACTIVE_SIDE_COUNT,
  payload: data,
});
export const setUserAuthorizations = (data = []) => ({
  type: SET_USER_AUTHORIZATIONS,
  payload: data,
});
export const updateUserWorkFlow = (data = {}) => ({
  type: UPDATE_USER_WORK_FLOW,
  payload: data,
});
export const updateIsApprover = (data = {}) => ({
  type: UPDATE_IS_APPROVER,
  payload: data,
});
export const setIsScheduler = (data = {}) => ({
  type: SET_IS_SCHEDULER_ENABLED,
  payload: data,
});
export const updateDrawerIndex = (data = {}) => ({
  type: UPDATE_DRAWER_INDEX,
  payload: data,
});
export const setCustomerRole = (data = "") => ({
  type: SET_CUSTOMER_ROLE,
  payload: data,
})

export const setCustomerInfo = (data = "") => ({
  type: SET_CUSTOMER_INFO,
  payload: data,
})