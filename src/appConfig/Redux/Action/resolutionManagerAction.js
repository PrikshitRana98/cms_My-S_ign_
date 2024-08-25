import {GET_RESOLUTION_DATA, REMOVE_RESOLUTION_DATA, RESET} from '../ActionTypes/commonActionTypes';

export const resetResoReducer = (data = []) => ({
  type: RESET,
  payload: [],
});
export const updateResolutionList = (data = []) => ({
  type: GET_RESOLUTION_DATA,
  payload: data,
});

export const removeResolutionList = (data = []) => ({
    type: REMOVE_RESOLUTION_DATA,
    payload: data,
});