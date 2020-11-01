import React, {Component} from "react";
import './App.css';
import Watching from "../Watching";

class App extends Component {
	render() {
		return (
			<div className="app">
				<header className="header">
					<div className="header__title">Карта</div>
				</header>

				<Watching/>
			</div>
		);
	}
}

export default App;
