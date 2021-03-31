import { v4 as uuidv4 } from "uuid"
import { FETCH_PIN_LIST_SUCCESS, ADD_RECEIVED_PIN } from '../actions/pinActions';


const othersPinsReducer = (state = {}, action) => {
    switch(action.type){
		case FETCH_PIN_LIST_SUCCESS:
			const othersPins = {}
			action.payload.forEach(pin => {
				const pinId = uuidv4()
				othersPins[pinId] = {...pin, pinId}
			})
			
			return othersPins
			
		case ADD_RECEIVED_PIN:
			const pinId = uuidv4()
			
			return {...state, [pinId]: {...(action.payload), pinId} }

		default:
			return state
    }
}

export default othersPinsReducer