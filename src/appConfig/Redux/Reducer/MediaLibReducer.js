import {
    GET_MEDIALIB_DATA,
    REMOVE_MEDIALIB_DATA,
    GET_MEDIA_ARCHIVED_DATA,
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      MediaLibList: [],
    };
    const MediaLibReducer = (state = initialState, action) => {
      switch (action.type) {
  
        case GET_MEDIALIB_DATA:
          return {
            ...state,
            MediaLibList: action.payload,
          };

          case GET_MEDIA_ARCHIVED_DATA:
            return {
              ...state,
              ArchivedList: action.payload,
            };  
  
          case REMOVE_MEDIALIB_DATA:
              const mediaIds = action.payload
              console.log("=========================================================",mediaIds)
              const removedMediaLibList = state.MediaLibList.filter(item => !mediaIds.includes(item.mediaDetailId));
              return {
                ...state,
                MediaLibList: removedMediaLibList,
              };
  
        default:
          return state;
      }
    };
    export default MediaLibReducer;