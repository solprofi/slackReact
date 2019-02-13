import * as actionTypes from './types';


// USER ACTION CREATORS
export const setUser = user => ({
  type: actionTypes.SET_USER,
  payload: {
    currentUser: user,
  }
})

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER,
  payload: {}
})

// CHANNELS ACTION CREATORS

export const setCurrentChannel = channel => ({
  type: actionTypes.SET_CURRENT_CHANNEL,
  payload: {
    currentChannel: channel,
  }
})

export const setPrivateChannel = isChannelPrivate => ({
  type: actionTypes.SET_PRIVATE_CHANNEL,
  payload: {
    isChannelPrivate,
  }
})

export const setUserPosts = userPosts => ({
  type: actionTypes.SET_USER_POSTS,
  payload: {
    userPosts,
  }
})

// COLORS ACTION CREATORS

export const setColors = (primary, secondary) => ({
  type: actionTypes.SET_COLORS,
  payload: {
    primary, secondary
  }
})