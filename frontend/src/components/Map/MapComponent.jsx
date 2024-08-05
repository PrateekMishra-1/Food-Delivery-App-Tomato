import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ origin, destination }) => {
    useEffect(() => {
        // Calculate the route between origin and destination
        // Here we are using a simple line, but you can implement a routing service if needed
    }, [origin, destination]);

    return (
        <MapContainer center={origin} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={origin}>
                <Popup>Origin</Popup>
            </Marker>
            <Marker position={destination}>
                <Popup>Destination</Popup>
            </Marker>
            <Polyline positions={[origin, destination]} />
        </MapContainer>
    );
};

export default MapComponent;
