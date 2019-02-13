import * as actionTypes from '../actions/types';
import { combineReducers } from 'redux';


const initialUserState = {
  currentUser: null,
  isLoading: true,
}

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}

const initialChannelsState = {
  currentChannel: null,
  isChannelPrivate: false,
  userPosts: null,
}

const channelsReducer = (state = initialChannelsState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      }
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isChannelPrivate: action.payload.isChannelPrivate,
      }
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts,
      }
    default:
      return state;
  }
}

const initialColorsState = {
  primary: '#4c3c4c',
  secondary: '#eee',
}

const colorsReducer = (state = initialColorsState, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primary: action.payload.primary,
        secondary: action.payload.secondary,
      }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  channels: channelsReducer,
  colors: colorsReducer,
});

export default rootReducer;