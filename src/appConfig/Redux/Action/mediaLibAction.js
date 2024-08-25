import { type } from 'os';
import {
  GET_MEDIALIB_DATA, 
  REMOVE_MEDIALIB_DATA,
  GET_MEDIA_ARCHIVED_DATA,
  RESET
} from '../ActionTypes/commonActionTypes';

export const resetMediaReducers=()=>({
  type:RESET,
  payload:[]
})

export const updateMediaLib = (data = []) => ({
  type: GET_MEDIALIB_DATA,
  payload: data,
});

export const updateArchivedList = (data = []) => ({
  type: GET_MEDIA_ARCHIVED_DATA,
  payload: data,
});

export const removeMediaLib = (data = []) => ({
    type: REMOVE_MEDIALIB_DATA,
    payload: data,
  });