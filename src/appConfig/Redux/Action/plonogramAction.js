import {GET_PLONOGRAM_DATA, GET_PLONOGRAM_ARCHIVE_DATA, REMOVE_PLONOGRAM_DATA, RESET} from '../ActionTypes/commonActionTypes';

export const resetPlanogramReducer = (data = []) => ({
  type: RESET,
  payload: [],
});
export const updatePlonogramList = (data = []) => ({
  type: GET_PLONOGRAM_DATA,
  payload: data,
});

export const updatePlonogramArchiveList = (data = []) => ({
    type: GET_PLONOGRAM_ARCHIVE_DATA,
    payload: data,
});

export const removePlonogramList = (data = []) => ({
    type: REMOVE_PLONOGRAM_DATA,
    payload: data,
});

