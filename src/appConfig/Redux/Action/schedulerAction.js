import { GET_SCHEDULAR_ARCHIVE_DATA, GET_SCHEDULAR_DATA, REMOVE_SCHEDULAR_DATA } from "../ActionTypes/commonActionTypes";

export const updateSchedulerList = (data = []) => ({
  type: GET_SCHEDULAR_DATA,
  payload: data,
});

export const updateSchedulerArchiveList = (data = []) => ({
    type: GET_SCHEDULAR_ARCHIVE_DATA,
    payload: data,
});

export const removeSchedulerList = (data = []) => ({
    type: REMOVE_SCHEDULAR_DATA,
    payload: data,
});

