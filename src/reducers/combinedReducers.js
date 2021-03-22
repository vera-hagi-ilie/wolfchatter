import {combineReducers} from "redux"
import {reducer as formReducer} from "redux-form"
import chatRoomReducer from "./chatRoomReducer"
import {ownPinsReducer, latestOwnPinReducer} from "./ownPinsReducer"
import othersPinsReducer from "./othersPinsReducer"
import currentPinIdReducer from "./currentPinIdReducer"
import activatedRoomsReducer from "./activatedRoomsReducer"

export default combineReducers({ownPins: ownPinsReducer,
								othersPins: othersPinsReducer,
								latestOwnPin: latestOwnPinReducer,
								activatedRooms: activatedRoomsReducer,
								chatRoom: chatRoomReducer,
							    currentPinId: currentPinIdReducer,
							    form: formReducer})