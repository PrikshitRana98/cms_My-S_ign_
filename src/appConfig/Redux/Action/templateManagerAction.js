import {GET_TEMPLATE_DATA, GET_TEMPLATE_DATA_PAGINATION, REMOVE_TEMPLATE_DATA, RESET} from '../ActionTypes/commonActionTypes';

export const resetTemplateReducer = (data = []) => ({
  type: RESET,
  payload: [],
});
export const updateTemplates = (data = []) => ({
  type: GET_TEMPLATE_DATA,
  payload: data,
});
export const updateTemplatesPagination = (data = []) => ({
  type: GET_TEMPLATE_DATA_PAGINATION,
  payload: data,
});
export const removeTemplates = (data = []) => ({
    type: REMOVE_TEMPLATE_DATA,
    payload: data,
  });