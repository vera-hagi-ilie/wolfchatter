import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reduxThunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import combinedReducers from '../reducers/combinedReducers'
import WebSocketProvider from '../websocket/webSocket';
import Map from './Map';
import Panel from "./Panel"
import './App.css';

const store = createStore(combinedReducers, 
						  composeWithDevTools(applyMiddleware(reduxThunk)))

function App() {
			
	return (
		<Provider store={store}>
			<WebSocketProvider>
				<div className="App">
					<Map />
					<Panel />
				</div>
			</WebSocketProvider>
		</Provider>
	)
}

export default App;
