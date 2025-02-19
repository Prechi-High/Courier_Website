import { useEffect, useState } from "react";
import {  Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";

// Fix marker icon issue for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
});

// Custom Icons
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2596/2596007.png", // Navy blue truck icon
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Red destination pin icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://back-one-navy.vercel.app/track/api/tracking/${trackingNumber}`
      );

      if (response.status !== 200) {
        throw new Error("Tracking information not found.");
      }

      setTrackingData(response.data);
      setError("");
    } catch (err) {
      setTrackingData(null);
      setError(
        err.response?.data?.message || "Error retrieving tracking info."
      );
    } finally {
      setLoading(false);
    }
  };

  return (


    <div className="cover">
      <div className="nav">
    <div><Link to="/" ><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo"/></Link></div>
    <div> <Link to="/login" className="button2">Track</Link></div>
  </div>
      <div className="homepage">
        <div className="content">
          <div>
            <h1>Track Your Package</h1>
            <input
              type="text"
              placeholder="Enter Tracking Number"
              value={trackingNumber}
              className="input"
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <button onClick={handleTrack} disabled={loading} className="button">
              {loading ? "Tracking..." : "Track"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {trackingData && (
              <div className="details">
                <div className="detailMain">
                  <div>
                <h4 className="Tcour">Courier: {trackingData.courier}</h4>
                <p className="Tnum">Tracking Number: {trackingData.trackingNumber}</p>

                <div className="locationbox"><div className="imgBox"><img src="https://www.nicepng.com/png/full/9-94335_location-icon-location-icon-png-blue.png" className="icon"/></div><span className="locationtext"><h5>Starting Point:</h5> 
                <p> {trackingData.from}</p></span></div>

                <div className="locationbox"><div className="imgBox"><img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" className="icon"/></div><span className="locationtext"><h5>Destination:</h5> 
                <p> {trackingData.destination}</p></span></div>

                <div className="locationbox"><div className="imgBox"><img src="https://cdn3.iconfinder.com/data/icons/camping-flat-colorful/614/2702_-_Distance-1024.png"  className="icon"/></div><span className="locationtext"><h5>Current Location:</h5> 
                <p> {trackingData.current}</p></span></div>

                 <div className="locationbox"><div className="imgBox"><img src="https://static.vecteezy.com/system/resources/previews/016/774/636/original/3d-delivery-truck-icon-on-transparent-background-free-png.png" className="icon"/></div><span className="locationtext"><h5>Distance Remaining:</h5> 
                <p> {trackingData.distanceRemaining}</p></span></div>




             </div>
             </div>
                <h2>Live Map</h2>
                <MapContainer
                  center={[trackingData.latitude, trackingData.longitude]}
                  zoom={4}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Start Location Marker */}
                  <Marker
                    position={[trackingData.latitude, trackingData.longitude]}
                  >
                    <Popup>
                      <strong>Start location</strong>
                      <br />
                      Name: {trackingData.from}
                      <br />
                      Latitude: {trackingData.latitude}
                      <br />
                      Longitude: {trackingData.longitude}
                    </Popup>
                  </Marker>

                  {/* Current Location Marker (Navy Blue Truck) */}
                  <Marker
                    position={[
                      trackingData.currentLatitude,
                      trackingData.currentLongitude,
                    ]}
                    icon={truckIcon}
                  >
                    <Popup>
                      <strong>Current Location</strong>
                      <br />
                      Name: {trackingData.current}
                      <br />
                      Latitude: {trackingData.currentLatitude}
                      <br />
                      Longitude: {trackingData.currentLongitude}
                    </Popup>
                  </Marker>

                  {/* Destination Location Marker (Red Pin) */}
                  <Marker
                    position={[
                      trackingData.destinationLatitude,
                      trackingData.destinationLongitude,
                    ]}
                    icon={destinationIcon}
                  >
                    <Popup>
                      <strong>Destination</strong>
                      <br />
                      Name: {trackingData.destination}
                      <br />
                      Latitude: {trackingData.destinationLatitude}
                      <br />
                      Longitude: {trackingData.destinationLongitude}
                    </Popup>
                  </Marker>

                  {/* Route Line (Polyline) */}
                  <Polyline
                    positions={[
                      [trackingData.latitude, trackingData.longitude], // Start
                      [
                        trackingData.currentLatitude,
                        trackingData.currentLongitude,
                      ], // Current
                      [
                        trackingData.destinationLatitude,
                        trackingData.destinationLongitude,
                      ], // Destination
                    ]}
                    color="blue"
                    weight={4}
                  />
                </MapContainer>

              </div>
            )}
          </div>
        </div>
      </div>
      <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
    </div>
  
  );
}
