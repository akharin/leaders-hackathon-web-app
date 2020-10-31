import {latLng, latLngBounds} from "leaflet";

export function determineBounds(objects) {
	let minLat = Infinity;
	let minLng = Infinity;
	let maxLat = -Infinity;
	let maxLng = -Infinity;

	for (const object of objects) {
		for (const point of object.polygon) {
			if (minLat > point.lat) {
				minLat = point.lat;
			}
			if (minLng > point.lng) {
				minLng = point.lng;
			}
			if (maxLat < point.lat) {
				maxLat = point.lat;
			}
			if (maxLng < point.lng) {
				maxLng = point.lng;
			}
		}
	}

	return latLngBounds(latLng(minLat, minLng), latLng(maxLat, maxLng));
}
