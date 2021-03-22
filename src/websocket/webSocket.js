import React, { createContext } from 'react'
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { updateChatLog, changeRoomName } from '../actions/chatRoomActions';
import { addReceivedPin } from '../actions/pinActions';

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
        dispatch(updateChatLog(payload));
    }
	
	const sendRoomName = (roomId, roomName) => {
		const payload = {roomId, roomName}
		socket.emit("event://send-room-name", JSON.stringify(payload))
	}
		
	const sendNewPin = (coordinates, chatRoomId) => {
        const payload = { coordinates, chatRoomId}
        socket.emit("event://send-new-pin", JSON.stringify(payload));
    }

    if (!socket) {
		socket = io()

        socket.on("event://get-message", (msg) => {
            const payload = JSON.parse(msg);
            dispatch(updateChatLog(payload));
        })
		
		socket.on("event://get-room-name", (msg) => {
			const payload = JSON.parse(msg);
			dispatch(changeRoomName(payload));
		})
		
		socket.on("event://receive-new-pin", (msg) => {
            const payload = JSON.parse(msg);
            dispatch(addReceivedPin(payload));
        })

        ws = {
            socket: socket,
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