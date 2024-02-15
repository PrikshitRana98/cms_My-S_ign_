import {GET_PLONOGRAM_DATA, GET_PLONOGRAM_ARCHIVE_DATA, REMOVE_PLONOGRAM_DATA} from '../ActionTypes/commonActionTypes';

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

