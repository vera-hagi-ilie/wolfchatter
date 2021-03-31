import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { reset } from 'redux-form';
import _ from "lodash"
import { WebSocketContext } from '../websocket/webSocket';
import { SET_USERNAME, CHANGE_ROOM_NAME, LEAVE_CHAT_ROOM } from '../actions/chatRoomActions'
import { actionCreator } from '../actions/genericActions'
import EditableItem from "./EditableItem"
import './styles/ChatRoom.css'

function ChatRoom() {

	const roomId = useSelector(state => state.chatRoom.roomId)
	const roomName = useSelector(state => state.chatRoom.roomName)
	const userName = useSelector(state => (state.activatedRooms[roomId] && 
										   state.activatedRooms[roomId].userName))
	const chats = useSelector(state => state.chatRoom.chatLog)

	const dispatch = useDispatch();
	const ws = useContext(WebSocketContext)
	
	let writers = _.uniq(chats, "userName").map(item => item.userName)	

	
	const submitUserName = userInput => {
		dispatch(actionCreator(SET_USERNAME, {userName: userInput, chatRoomId: roomId}))
		dispatch(reset("messageInput"))
	}
	
	const submitRoomName = newName => {
		ws.sendRoomName(roomId, newName)
		dispatch(actionCreator(CHANGE_ROOM_NAME, {roomId: roomId, roomName: newName}))
	}
	
	const submitMessage = (msgInput) => {
		ws.sendMessage(roomId, {
			userName: userName || "Guest",
			message: msgInput
		});
	}
	
	const leaveRoom = () => {
		dispatch(actionCreator(LEAVE_CHAT_ROOM, null))
	}
	
	const validateUserName = (userInput) => (
		(userInput !== userName) && writers.includes(userInput) ?
		"Name is already in use" : null
	)
	
	const validateMessage = (userInput) => (
		(!userName) ? "Please submit a username first" : null
	)
	
    return (
		<article className="chat-window">
			<header className="chat-header">
				<EditableItem 
					name="room name" 
					title={roomName} 
					open={false} 
					maxlength="30"
					submitRequest={submitRoomName} 
					form="roomNameInput" 
				/>
				<div className="chat-header__controls">
					<button 
						className="chat-header__close" 
						onClick={leaveRoom} 
						aria-label="Leave chat room"
					>
						<i class="fa fa-window-close"></i>
					</button>
				</div>
			</header>
			
			<section className="chat-stream">
				{chats.map((chatItem, index) => (
					<div key={index}>
						<strong><i>{chatItem.userName}: </i></strong>
						{chatItem.message}
					</div>
				))}
			</section>
			
			<section className="chat-form">
				<div className="chat-form__user-name">
					{!userName && 
						<EditableItem 
							name="user name" 
							title="Guest" 
							open={true}
							editIconClasses="fa fa-user-edit" form="userName" 
							customValidator={validateUserName}
							submitRequest={submitUserName} 
						/>
					}
					{userName && 
						<EditableItem 
							name="user name" 
							title={userName}
							editIconClasses="fa fa-user-edit" 
							visibleLabel="Posting as: "
							maxlength="25"
							customValidator={validateUserName}
							submitRequest={submitUserName} 
							form="userNameInput" 
						/>
					}
				</div>
				<div className="chat-form__message">
					<EditableItem 
						name="new message" 
						open={true}
						alwaysOpen={true}
						maxlength="500"
						submitIconClasses="fa fa-paper-plane"
						submitRequest={submitMessage} 
						customValidator={validateMessage}
						form="messageInput" 
					/>
				</div>	
			</section>
		</article>
    )
}

export default ChatRoom