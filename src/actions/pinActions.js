import axios from 'axios';
import { actionCreator } from './genericActions'
import { joinRoom } from "./chatRoomActions"


export const CREATE_ROOM_REQUEST = "CREATE_ROOM_REQUEST"
export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS"
export const CREATE_ROOM_ERROR = "CREATE_ROOM_ERROR"
export const FETCH_PIN_LIST_REQUEST = "FETCH_PIN_LIST_REQUEST"
export const FETCH_PIN_LIST_SUCCESS = "FETCH_PIN_LIST_SUCCESS"
export const FETCH_PIN_LIST_ERROR = "FETCH_PIN_LIST_ERROR"
export const ADD_RECEIVED_PIN = "ADD_RECEIVED_PIN"


export function createAndJoinRoom(pinId, coordinates) {
    return async dispatch => {
		
        dispatch(actionCreator(CREATE_ROOM_REQUEST, {pinId, coordinates}))
		
        try{
            const response = await axios.get(
				`api/rooms/new?lng=${coordinates.lng}&lat=${coordinates.lat}`
			)
			const chatRoomId = response.data
            await dispatch(actionCreator(CREATE_ROOM_SUCCESS, {pinId, coordinates, chatRoomId}));
			dispatch(joinRoom(pinId)); 
			
        }catch(error){
            dispatch(actionCreator(CREATE_ROOM_ERROR, error));
        }
    }
}

export function fetchPinList () {
    return async dispatch => {
		
        dispatch(actionCreator(FETCH_PIN_LIST_REQUEST, null))
		
        try{
			const response = await axios.get(`api/rooms/`)
            dispatch(actionCreator(FETCH_PIN_LIST_SUCCESS, response.data))
			
        }catch(error){
            dispatch(actionCreator(FETCH_PIN_LIST_ERROR, error))
        }
    }
}

