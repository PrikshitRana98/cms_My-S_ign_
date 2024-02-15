import {
    GET_CAMPAIGN_STRING_DATA,
    REMOVE_CAMPAIGN_STRING_DATA,
    GET_CAMPAIGN_STRING_ARCHIVE_DATA
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      userDetails: {},
      appLoader: false,
      campaignStringList: [],
      campaignStringArchiveList: [],
    };
  
    const campaignReducer = (state = initialState, action) => {
      switch (action.type) {
        case GET_CAMPAIGN_STRING_DATA:
          return {
            ...state,
            campaignStringList: action.payload,
          };
        case GET_CAMPAIGN_STRING_ARCHIVE_DATA:
          return {
            ...state,
            campaignStringArchiveList: action.payload,
          };
        case REMOVE_CAMPAIGN_STRING_DATA:
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
    