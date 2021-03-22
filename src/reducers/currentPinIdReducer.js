import { CREATE_ROOM_REQUEST} from '../actions/pinActions';
import { JOIN_ROOM_REQUEST, LEAVE_CHAT_ROOM} from '../actions/chatRoomActions';

const currentPinIdReducer = (state = null, action) => {
    switch(action.type){
		case CREATE_ROOM_REQUEST:
			return action.payload
        case JOIN_ROOM_REQUEST:
            return action.payload.pinId
		case LEAVE_CHAT_ROOM:
			return null

		default:
			return state
    }
}

export default currentPinIdReducer