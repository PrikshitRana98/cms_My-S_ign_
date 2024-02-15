import {
  UPDATE_REGISTER_DEVICE_LIST
    } from '../ActionTypes/commonActionTypes';
    
    const initialState = {
      registerDevices: {},
    };
  
    const deviceReducer = (state = initialState, action) => {
      switch (action.type) {
        case UPDATE_REGISTER_DEVICE_LIST:
          return {
            ...state,
            registerDevices: action.payload,
          };
         break;
        default:
          return state;
      }
    };
    export default deviceReducer;
    