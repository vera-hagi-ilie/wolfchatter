import {useEffect, useRef, useContext} from "react"
import MapTool from "./MapTool"
import {useSelector, useDispatch } from 'react-redux'
import { WebSocketContext } from '../websocket/webSocket';
import { createAndJoinRoom, fetchPinList } from '../actions/pinActions';
import {joinRoom } from '../actions/chatRoomActions'


const Map = props => {
	    
	const latestOwnPinCreated = useSelector(state => state.latestOwnPin)
	const othersPins = useSelector(state => state.othersPins)
	const currentPinId = useSelector(state => state.currentPinId)

	const ws = useRef(useContext(WebSocketContext))
	const dispatch = useDispatch()

	
	useEffect(() => {
		const onClickOnMapCallback = (pinId, coordinates) => {
			dispatch(createAndJoinRoom(pinId, coordinates))
		}
		
		const pinClickCallback = (pinId) => {
			dispatch(joinRoom(pinId))
		}
		
		MapTool.initialize({onClickOnMapCallback,
						    pinClickCallback
		})
		
		dispatch(fetchPinList())
		
	},[dispatch])

	
	useEffect(() => {
		MapTool.render(othersPins)
		
	},[othersPins])
	
	
	useEffect(() => {
		MapTool.highlightPin(currentPinId)
		
	},[currentPinId])
	
	
	useEffect(() => {
		if (latestOwnPinCreated){
			ws.current.sendNewPin(latestOwnPinCreated.coordinates, 
								  latestOwnPinCreated.chatRoomId)
		}
		
	},[latestOwnPinCreated])
		
	return null
}

export default Map