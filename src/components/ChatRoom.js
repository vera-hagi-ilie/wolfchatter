import React, { useContext } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import {reset} from 'redux-form';
import _ from "lodash"
import { WebSocketContext } from '../websocket/webSocket';
import {setUsername, leaveChatRoom, changeRoomName} from '../actions/chatRoomActions'
import EditableItem from "./EditableItem"

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
		dispatch(setUsername({userName: userInput, chatRoomId: roomId}))
		dispatch(reset("messageInput"))
	}
	
	const submitRoomName = newName => {
		ws.sendRoomName(roomId, newName)
		dispatch(changeRoomName({roomId: roomId, roomName: newName}))
	}
	
	const leaveRoom = () => {
		dispatch(leaveChatRoom())
	}

	const sendMessage = (msgInput) => {
		ws.sendMessage(roomId, {
			userName: userName || "Guest",
			message: msgInput
		});
	}
	
	const validateUserName = (userInput) => (
		(userInput !== userName) && writers.includes(userInput) ?
		"Name is already in use" : null
	)
	
	const validateMessage = (userInput) => (
		(!userName) ? "Please type a username first" : null
	)
	
    return (
		<article className="chat-window">
			<header className="header">
				<EditableItem 
					name="room name" 
					title={roomName} 
					open={false} 
					onSubmitRequest={submitRoomName} 
					form="roomNameInput" 
				/>
				<div className="header__controls">
					<button 
						className="header__close" 
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
				{!userName && 
					<EditableItem 
						name="user name" 
						title="Guest" 
						open={true}
						editIconClasses="fa fa-user-edit" form="userName" 
						customValidator={validateUserName}
						onSubmitRequest={submitUserName} 
					/>
				}
				{userName && 
					<EditableItem 
						name="user name" 
						title={userName}
						editIconClasses="fa fa-user-edit" 
						visibleLabel="Posting as: "
						customValidator={validateUserName}
						onSubmitRequest={submitUserName} 
						form="userNameInput" 
					/>
				}
				<div className="control">
					<EditableItem 
							name="new message" 
							open={true}
						    alwaysOpen={true}
							maxlength={160}
							submitIconClasses="fa fa-paper-plane"
							onSubmitRequest={sendMessage} 
						    customValidator={validateMessage}
							form="messageInput" 
						/>
				</div>	
			</section>
		</article>
    )
}

export default ChatRoom