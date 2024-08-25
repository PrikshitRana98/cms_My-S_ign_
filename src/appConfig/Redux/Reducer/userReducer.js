import {
  GET_ACTIVE_DATA,
  GET_USER_DATA,
  RESET,
  SET_CUSTOMER_INFO,
  SET_CUSTOMER_ROLE,
  SET_IS_SCHEDULER_ENABLED,
  SET_RECENT_MEDIA_UPLOAD,
  SET_USER_AUTHORIZATIONS,
  UPDATE_ACTIVE_SIDE_COUNT,
  UPDATE_DRAWER_INDEX,
  UPDATE_IS_APPROVER,
  UPDATE_USER_WORK_FLOW,
} from "../ActionTypes/commonActionTypes";

const initialState = {
  userDetails: {},
  appLoader: false,
  activeSite: {},
  recentMedia: null,
  activeSideCount: 0,
  authorization: [],
  workFlow: null,
  isApprover: false,
  isSchedulerEnabled: false,
  selectedIndex: {
    index: 0,
    subIndex: null,
  },
  customerRole:null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET:()=>initialState;
    case GET_USER_DATA:
      return {
        ...state,
        userDetails: action.payload,
      };
    case GET_ACTIVE_DATA:
      return {
        ...state,
        activeSite: action.payload,
      };
    case UPDATE_USER_WORK_FLOW:
      return {
        ...state,
        workFlow: action.payload,
      };
    case UPDATE_ACTIVE_SIDE_COUNT:
      return {
        ...state,
        activeSideCount: action.payload,
      };
    case SET_RECENT_MEDIA_UPLOAD:
      return {
        ...state,
        recentMedia: action.payload,
      };
    case SET_USER_AUTHORIZATIONS:
      return {
        ...state,
        authorization: action.payload,
      };
    case UPDATE_IS_APPROVER:
      return {
        ...state,
        isApprover: action.payload,
      };
    case SET_IS_SCHEDULER_ENABLED:
      return {
        ...state,
        isSchedulerEnabled: action.payload,
      };
    case UPDATE_DRAWER_INDEX:
      return {
        ...state,
        selectedIndex: action.payload,
      };
    case SET_CUSTOMER_ROLE:
      return {
        ...state,
        customerRole: action.payload,
      };
    case SET_CUSTOMER_INFO:
      return {
        ...state,
        userRole: action.payload,
      };  
    default:
      return state;
  }
};
export default userReducer;
