import { SET_USERNAME } from '../actions/chatRoomActions';

const activatedRoomsReducer = (state = {}, action) => {
    switch(action.type){
		case SET_USERNAME:
			return ({...state, [action.payload.chatRoomId]: {...action.payload}})

		default:
			return state
    }
}

export default activatedRoomsReducer