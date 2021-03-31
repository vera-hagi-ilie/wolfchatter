import { CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS } from '../actions/pinActions';

export const ownPinsReducer = (state = {}, action) => {
    switch(action.type){
		case CREATE_ROOM_REQUEST:
			return {...state, [action.payload.pinId]: {...action.payload }}
	
        case CREATE_ROOM_SUCCESS:
            return {...state, [action.payload.pinId]:{...action.payload }}

		default:
			return state
    }
}

export const latestOwnPinReducer = (state = null, action) => {
    switch(action.type){
        case CREATE_ROOM_SUCCESS:
            return {...action.payload }

		default:
			return state
    }
}