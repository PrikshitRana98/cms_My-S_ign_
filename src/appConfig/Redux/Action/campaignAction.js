import {GET_CAMPAIGN_DATA, REMOVE_CAMPAIGN_DATA,GET_CAMPAIGN_ARCHIVE_DATA, RESET} from '../ActionTypes/commonActionTypes';

export const resetCampaignReducers = (data = []) => ({
  type: RESET,
  payload: data,
});
export const updateCampaingnList = (data = []) => ({
  type: GET_CAMPAIGN_DATA,
  payload: data,
});

export const updateCampaingnArchiveList = (data = []) => ({
    type: GET_CAMPAIGN_ARCHIVE_DATA,
    payload: data,
});

export const removeCampaingnList = (data = []) => ({
    type: REMOVE_CAMPAIGN_DATA,
    payload: data,
});

