import {
  GET_CAMPAIGN_DATA,
  REMOVE_CAMPAIGN_DATA,
  GET_CAMPAIGN_ARCHIVE_DATA,
  RESET
  } from '../ActionTypes/commonActionTypes';
  
  const initialState = {
    userDetails: {},
    appLoader: false,
    campaignList: [],
    campaignArchiveList: [],
  };

  const campaignReducer = (state = initialState, action) => {
    switch (action.type) {
      case RESET:()=>initialState;
      case GET_CAMPAIGN_DATA:
        
        return {
          ...state,
          campaignList: action.payload,
        };
      case GET_CAMPAIGN_ARCHIVE_DATA:
        return {
          ...state,
          campaignArchiveList: action.payload,
        };
      case REMOVE_CAMPAIGN_DATA:
        const campaignIds = action.payload
        console.log("=========================================================",campaignIds)
        const removedCampaignList = state.campaignList.filter(item => !campaignIds.includes(item.campaignId));
        return {
          ...state,
          campaignList: removedCampaignList,
        };
      default:
        return state;
    }
  };
  export default campaignReducer;
  