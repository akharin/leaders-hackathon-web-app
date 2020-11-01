import React from 'react';
import './Watching.css';
import io from "socket.io-client";
import {MapContainer, TileLayer, Marker, Polygon, LayerGroup} from 'react-leaflet';
import {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import marker from './images/marker.svg';
import buildingIcon from './images/building.svg';
import personIcon from './images/person.svg';
import backIcon from './images/back.svg';
import {convertObjectCoords} from "./utils/convertObjectCoords";
import {determineBounds} from "./utils/determineBounds";
import {backendUrl} from "../../backendUrl";
import SideListItem from "../SideListItem";

const markerIcon = new Icon({
	iconUrl: marker,
	iconSize: [40, 40],
	iconAnchor: [20, 20]
});

class Watching extends React.Component {
	socket = undefined;
	map = undefined;
	lastWatchingObject = undefined;
	clearMarkersTimeout = undefined;
	objectsLayer = React.createRef();

	constructor(props) {
		super(props);

		this.state = {
			objects: [],
			users: [],
			usersMap: {},
			locations: [],
			currentObject: undefined
		};
	}

	componentDidMount() {
		this.getObjects();
		this.getUsers();

		this.socket = io(backendUrl, {path: '/api/ws', withCredentials: false});
	}

	componentWillUnmount() {
		this.stopWatching();
		if (this.socket) {
			this.socket.disconnect();
		}
	}

	render() {
		const {objects, usersMap, locations, currentObject} = this.state;

		return (
			<div className="watching-page">
				<div className="watching-page__side">
					{currentObject && (
						<div className="watching-page__back-btn-wrap">
							<button className="watching-page__back-btn" onClick={this.restoreView}>
								<img src={backIcon} alt=""/>

								К списку объектов
							</button>
						</div>
					)}

					{currentObject ? locations.map((loc, i) => (
						<SideListItem
							key={i}
							title={usersMap[loc.userId].name}
							desc={usersMap[loc.userId].position}
							icon={personIcon}
						/>
					)) : objects.map((object, i) => (
						<SideListItem
							key={object._id}
							title={object.name}
							icon={buildingIcon}
							showArrowBtn={true}
							onClick={() => this.handleListObjectClick(object._id, i)}
						/>
					))}
				</div>

				<MapContainer
					className="watching-page__map"
					center={[58.0105, 56.2502]}
					zoom={12}
					attributionControl={false}
					animate
					whenCreated={this.saveMapRef}
				>
					<TileLayer
						// url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						url="http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
						// url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
					/>

					<LayerGroup ref={this.objectsLayer}>
						{objects.map(object => (
							<Polygon
								key={object._id}
								positions={convertObjectCoords(object.polygon)}
								pathOptions={{
									fillColor: '#3391FF',
									fillOpacity: 0.5,
									stroke: false
								}}
								eventHandlers={{
									click: (event) => this.handleMapObjectClick(event, object._id)
								}}
							/>
						))}
					</LayerGroup>

					{locations.map((location, index) => (
						<Marker
							key={index}
							icon={markerIcon}
							position={[location.lat, location.lng]}
							title={location.userId}
						/>
					))}
				</MapContainer>
			</div>
		);
	}

	getObjects = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/objects`);
			if (response.ok) {
				const objects = await response.json();
				this.setState({objects}, () => {
					const bounds = determineBounds(objects);
					this.map.fitBounds(bounds);
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	getUsers = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/users`);
			if (response.ok) {
				const users = await response.json();
				this.setState({
					users,
					usersMap: users.reduce((prev, item) => {
						prev[item._id] = item;
						return prev;
					}, {})
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	handleListObjectClick = (objectId, index) => {
		const bounds = this.objectsLayer.current.getLayers()[index].getBounds();
		this.selectObject(objectId, bounds);
	};

	handleMapObjectClick = (event, objectId) => {
		this.selectObject(objectId, event.target.getBounds());
	};

	selectObject = (objectId, bounds) => {
		if (this.map) {
			this.map.fitBounds(bounds);
		}
		this.setState({currentObject: objectId});
		this.stopWatching();
		this.startWatching(objectId);
	}

	startWatching = (objectId) => {
		if (this.socket) {
			this.lastWatchingObject = objectId;
			this.socket.on('locationsUpdated', this.update);
			this.socket.emit('startWatching', {objectId});
		}
	};

	stopWatching = () => {
		if (this.lastWatchingObject && this.socket) {
			this.socket.emit('stopWatching', {objectId: this.lastWatchingObject});
			this.socket.off('locationsUpdated', this.update);
			this.lastWatchingObject = undefined;
		}
	};

	restoreView = () => {
		this.stopWatching();
		if (this.clearMarkersTimeout) {
			clearTimeout(this.clearMarkersTimeout);
		}
		this.setState({currentObject: undefined, locations: []}, () => {
			const bounds = determineBounds(this.state.objects);
			this.map.fitBounds(bounds);
		});
	};

	update = (locations) => {
		this.setState({locations});
		if (this.clearMarkersTimeout) {
			clearTimeout(this.clearMarkersTimeout);
		}
		this.clearMarkersTimeout = setTimeout(() => {
			this.setState({locations: []});
		}, 10000)
	};

	saveMapRef = (map) => {
		this.map = map;
	};
}

export default Watching;
