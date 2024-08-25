import {
    GET_TEMPLATE_DATA,
    GET_TEMPLATE_DATA_PAGINATION,
    REMOVE_TEMPLATE_DATA,
    RESET,
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      templateList: [],
      templatePagination:{}
    };
    const templateReducer = (state = initialState, action) => {
      switch (action.type) {
        case RESET:()=>initialState;
        case GET_TEMPLATE_DATA:
          return {
            ...state,
            templateList: action.payload,
          };

        case GET_TEMPLATE_DATA_PAGINATION:
        return {
          ...state,
          templatePagination: action.payload,
        };  
  
        case REMOVE_TEMPLATE_DATA:
            const templateIds = action.payload
            const removedTemplateList = state.templateList.filter(item => !templateIds.includes(item.aspectRatioId));
        return {
          ...state,
          templateList: removedTemplateList,
        };
  
        default:
          return state;
      }
    };
    export default templateReducer;
    