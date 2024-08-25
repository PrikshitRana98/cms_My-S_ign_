import {
    GET_PLONOGRAM_DATA,
    GET_PLONOGRAM_ARCHIVE_DATA,
    REMOVE_PLONOGRAM_DATA,
    RESET
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      userDetails: {},
      appLoader: false,
      plonogramList: [],
      campaignplogramList: [],
    };
  
    const plonogramReducer = (state = initialState, action) => {
      switch (action.type) {
        case RESET:()=>initialState;
        case GET_PLONOGRAM_DATA:
          return {
            ...state,
            plonogramList: action.payload,
          };
        case GET_PLONOGRAM_ARCHIVE_DATA:
          return {
            ...state,
            campaignplogramList: action.payload,
          };
        case REMOVE_PLONOGRAM_DATA:
          const plonogramIds = action.payload
          console.log("=========================================================",plonogramIds)
          const removedPlonogramList = state.plonogramList.filter(item => !plonogramIds.includes(item.campaignId));
          return {
            ...state,
            plonogramList: removedPlonogramList,
          };
        default:
          return state;
      }
    };
    export default plonogramReducer;
    