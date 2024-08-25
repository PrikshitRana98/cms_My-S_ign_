import {
    GET_RESOLUTION_DATA,
    REMOVE_RESOLUTION_DATA,
    RESET,
  } from '../ActionTypes/commonActionTypes';
  
  const initialState = {
    userDetails: {},
    appLoader: false,
    resolutionList: [],
  };
  const resolutionReducer = (state = initialState, action) => {
    switch (action.type) {
      case RESET:()=>initialState;
      case GET_RESOLUTION_DATA:
        return {
          ...state,
          resolutionList: action.payload,
        };

        case REMOVE_RESOLUTION_DATA:
            const resolutionIds = action.payload
            const removedResolutionList = state.resolutionList.filter(item => !resolutionIds.includes(item.aspectRatioId));
        return {
          ...state,
          resolutionList: removedResolutionList,
        };

      default:
        return state;
    }
  };
  export default resolutionReducer;
  