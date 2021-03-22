import axios from 'axios';
import {joinRoom} from "./chatRoomActions"


export const CREATE_ROOM_REQUEST = "CREATE_ROOM_REQUEST"
export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS"
export const CREATE_ROOM_ERROR = "CREATE_ROOM_ERROR"
export const FETCH_PIN_LIST_REQUEST = "FETCH_PIN_LIST_REQUEST"
export const FETCH_PIN_LIST_SUCCESS = "FETCH_PIN_LIST_SUCCESS"
export const FETCH_PIN_LIST_ERROR = "FETCH_PIN_LIST_ERROR"
export const ADD_RECEIVED_PIN = "ADD_RECEIVED_PIN"


export const createRoomRequest = payload => ({
	type: CREATE_ROOM_REQUEST,
	payload 
})

export const createRoomSuccess = payload => ({
	type: CREATE_ROOM_SUCCESS,
	payload
})

export const createRoomError = error => ({
	type: CREATE_ROOM_ERROR,
	error
})

export const fetchPinListRequest = () => ({
	type: FETCH_PIN_LIST_REQUEST
})

export const fetchPinListSuccess = payload => ({
	type: FETCH_PIN_LIST_SUCCESS,
	payload
})

export const fetchPinListError = error => ({
	type: FETCH_PIN_LIST_ERROR,
	error
})

export const addReceivedPin = receivedPin => ({ 
	type: ADD_RECEIVED_PIN,
	payload: receivedPin
})



export function createAndJoinRoom(pinId, coordinates) {
    return async dispatch => {
        dispatch(createRoomRequest(pinId))
        try{
            const response = await axios.get(
				`api/rooms/new?lng=${coordinates.lng}&lat=${coordinates.lat}`
			)
			const chatRoomId = response.data
            await dispatch(createRoomSuccess({pinId, coordinates, chatRoomId}));
			dispatch(joinRoom(pinId)); 
        }catch(error){
            dispatch(createRoomError(error));
        }
    }
}

export function fetchPinList () {
    return async dispatch => {
        dispatch(fetchPinListRequest())
        try{
			const response = await axios.get(`api/rooms/`)
            dispatch(fetchPinListSuccess(response.data))
        }catch(error){
            dispatch(fetchPinListError(error))
        }
    }
}

