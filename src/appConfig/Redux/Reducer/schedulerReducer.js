import {
    GET_SCHEDULAR_DATA
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      userDetails: {},
      appLoader: false,
      schedulerList: [],
      campaignplogramList: [],
    };
  
    const schedulerReducer = (state = initialState, action) => {
      switch (action.type) {
        case GET_SCHEDULAR_DATA:
          return {
            ...state,
            schedulerList: action.payload,
          };
        // case GET_SCHEDULAR_ARCHIVE_DATA:
        //   return {
        //     ...state,
        //     campaignplogramList: action.payload,
        //   };
        // case REMOVE_SCHEDULAR_DATA:
        //   const plonogramIds = action.payload
        //   console.log("=========================================================",plonogramIds)
        //   const removedPlonogramList = state.plonogramList.filter(item => !plonogramIds.includes(item.campaignId));
        //   return {
        //     ...state,
        //     plonogramList: removedPlonogramList,
        //   };
        default:
          return state;
      }
    };
    export default schedulerReducer;
    