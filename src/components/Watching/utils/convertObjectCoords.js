export function convertObjectCoords(coords) {
	return coords.map(item => [item.lat, item.lng]);
}
