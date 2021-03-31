import React, { createContext } from 'react'
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { actionCreator } from '../actions/genericActions'
import { UPDATE_CHAT_LOG, CHANGE_ROOM_NAME } from '../actions/chatRoomActions';
import { ADD_RECEIVED_PIN } from '../actions/pinActions';

const WebSocketContext = createContext(null)

export { WebSocketContext }

const WebSocketProvider = ({ children }) => {
    let socket = null
    let ws = null

    const dispatch = useDispatch()

    const sendMessage = (roomId, message) => {
        const payload = {
            roomId: roomId,
            data: message
        }
        socket.emit("event://send-message", JSON.stringify(payload));		
		dispatch(actionCreator(UPDATE_CHAT_LOG, payload));
    }
	
	const sendRoomName = (roomId, roomName) => {
		const payload = { roomId, roomName }
		socket.emit("event://send-room-name", JSON.stringify(payload))
	}
		
	const sendNewPin = (coordinates, chatRoomId) => {
        const payload = { coordinates, chatRoomId }
        socket.emit("event://send-new-pin", JSON.stringify(payload));
    }

    if (!socket) {
		socket = io()

        socket.on("event://get-message", (msg) => {
            const payload = JSON.parse(msg)
			dispatch(actionCreator(UPDATE_CHAT_LOG, payload));
        })
		
		socket.on("event://get-room-name", (msg) => {
			const payload = JSON.parse(msg)			
			dispatch(actionCreator(CHANGE_ROOM_NAME, payload));
		})
		
		socket.on("event://receive-new-pin", (msg) => {
            const payload = JSON.parse(msg)
			dispatch(actionCreator(ADD_RECEIVED_PIN, payload));
        })

        ws = {
            socket,
            sendMessage,
			sendNewPin,
			sendRoomName
        }
    }

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider