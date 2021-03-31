import axios from 'axios';
import { actionCreator } from './genericActions'

export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST"
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS"
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR"
export const LEAVE_CHAT_ROOM = "LEAVE_CHAT_ROOM"
export const CHANGE_ROOM_NAME = "CHANGE_ROOM_NAME"
export const SET_USERNAME = "SET_USERNAME"
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"


export function joinRoom(pinId) {
    return async function (dispatch, getState) {
		
		dispatch(actionCreator(JOIN_ROOM_REQUEST, {pinId}));
		
        try{
			const pin = getState().ownPins[pinId] || getState().othersPins[pinId]
			const roomId = pin.chatRoomId
            const response = await axios.get(`api/rooms/${roomId}`)		
			dispatch(actionCreator(JOIN_ROOM_SUCCESS, response.data));
			
        }catch(error){
            dispatch(actionCreator(JOIN_ROOM_ERROR, error));
        }
    }
}

