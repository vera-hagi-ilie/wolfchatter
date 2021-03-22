import axios from 'axios';

export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST"
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS"
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR"
export const LEAVE_CHAT_ROOM = "LEAVE_CHAT_ROOM"
export const CHANGE_ROOM_NAME = "CHANGE_ROOM_NAME"
export const SET_USERNAME = "SET_USERNAME"
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG"


export const joinRoomRequest = (payload) => ({
	type: JOIN_ROOM_REQUEST,
	payload
})

export const joinRoomSuccess = (payload) => ({
	type: JOIN_ROOM_SUCCESS,
	payload
})

export const joinRoomError = (error) => ({
	type: JOIN_ROOM_ERROR,
	error
})

export const setUsername = (payload) => ({
	type: SET_USERNAME,
	payload
})

export const changeRoomName = payload => ({
    type: CHANGE_ROOM_NAME,
    payload
})

export const updateChatLog = update => ({
	type: UPDATE_CHAT_LOG,
	update
})

export const leaveChatRoom = () => ({
    type: LEAVE_CHAT_ROOM
})


export function joinRoom(pinId) {
    return async function (dispatch, getState) {
        dispatch(joinRoomRequest({pinId}));
        try{
			const pin = getState().ownPins[pinId] || getState().othersPins[pinId]
			const roomId = pin.chatRoomId
            const response = await axios.get(`api/rooms/${roomId}`)
            dispatch(joinRoomSuccess(response.data));
        }catch(error){
            dispatch(joinRoomError(error));
        }
    }
}

