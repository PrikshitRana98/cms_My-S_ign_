import {GET_CAMPAIGN_STRING_DATA,REMOVE_CAMPAIGN_STRING_DATA,GET_CAMPAIGN_STRING_ARCHIVE_DATA, RESET} from '../ActionTypes/commonActionTypes';

export const resetCmpStringReducer = (data = []) => ({
  type: RESET,
  payload: [],
});
export const updateCampaingnStringList = (data = []) => ({
  type: GET_CAMPAIGN_STRING_DATA,
  payload: data,
});

export const updateCampaingnStringArchiveList = (data = []) => ({
    type: GET_CAMPAIGN_STRING_ARCHIVE_DATA,
    payload: data,
});

export const removeCampaingnStringList = (data = []) => ({
    type: REMOVE_CAMPAIGN_STRING_DATA,
    payload: data,
});

