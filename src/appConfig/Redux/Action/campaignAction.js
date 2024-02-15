import {GET_CAMPAIGN_DATA, REMOVE_CAMPAIGN_DATA,GET_CAMPAIGN_ARCHIVE_DATA} from '../ActionTypes/commonActionTypes';

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

