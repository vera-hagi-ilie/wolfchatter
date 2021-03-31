import { useSelector } from 'react-redux'
import ChatRoom from "./ChatRoom"
import { welcomeText } from "../texts/panelTexts"
import './styles/Panel.css'

const Panel = () => {
	const roomId = useSelector(state => state.chatRoom.roomId)

    return (
		<div className="panel">
			{roomId && <ChatRoom />}
			{!roomId &&
				<h1 class="welcome-text">{welcomeText}</h1>
			}
		</div>
    )
}

export default Panel