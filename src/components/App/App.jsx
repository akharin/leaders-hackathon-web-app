import React, {Component} from "react";
import './App.css';
import io from 'socket.io-client';
import Watching from "../Watching";
import {backendUrl} from "../backendUrl";

class App extends Component {
	socket = undefined;
	timer = undefined;

	componentDidMount() {
		this.socket = io(backendUrl, {path: '/api/ws', withCredentials: false});
	}

	render() {
		return (
			<div className="app">
				<header className="header">
					<div className="header__title">Карта</div>
				</header>

				<Watching/>

				<div style={{position: 'absolute', right: 0, bottom: 0, zIndex: 1000}}>
					<button onClick={this.sendFakeLocation}>start</button>
					<button onClick={this.stopSending}>stop</button>
				</div>
			</div>
		);
	}

	sendFakeLocation = () => {
		if (this.socket) {
			console.log(this.socket);
			this.socket.emit('sendLocation', {
				userId: '5f9c6e5aaca7c00c942b3a7f',
				objectId: '5f9d012b7fa50834a02feb6f',
				lat: 57.98898120493456,
				lng: 56.206569685599845,
				alt: 140
			});
		}
		this.timer = setTimeout(this.sendFakeLocation, 1000);
	};

	stopSending = () => {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	};
}

export default App;
