import {JOIN_ROOM_SUCCESS,  
		UPDATE_CHAT_LOG,
		CHANGE_ROOM_NAME,
		LEAVE_CHAT_ROOM} from '../actions/chatRoomActions';


const initialState = {
    roomId: null,
	roomName: "",
    chatLog: []
}


const chatRoomReducer = (state = initialState, action) => {
    switch(action.type){	
        case JOIN_ROOM_SUCCESS:
            return ({ roomId: action.payload.id, 
					  roomName: action.payload.name, 
					  chatLog: action.payload.chats })
			
		case UPDATE_CHAT_LOG:
			if(state.roomId !== null && action.payload.roomId === state.roomId){
              return {...state, chatLog: [...(state.chatLog), action.payload.data]}
			}
			return state
			
		case CHANGE_ROOM_NAME:
			if(state.roomId !== null && action.payload.roomId === state.roomId){
				return {...state, roomName: action.payload.roomName}
			}
			return state
			
		case LEAVE_CHAT_ROOM:
			return initialState

		default:
			return state
    
    }
}

export default chatRoomReducer

