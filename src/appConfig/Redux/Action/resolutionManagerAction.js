import {GET_RESOLUTION_DATA, REMOVE_RESOLUTION_DATA} from '../ActionTypes/commonActionTypes';

export const updateResolutionList = (data = []) => ({
  type: GET_RESOLUTION_DATA,
  payload: data,
});

export const removeResolutionList = (data = []) => ({
    type: REMOVE_RESOLUTION_DATA,
    payload: data,
});