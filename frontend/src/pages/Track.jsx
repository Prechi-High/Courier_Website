import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function Track() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AlzaSyr9B5UKvem9517LrUZaQeHX0MVLj7ZcRzb", // Replace with your API key
    libraries: ["places"],
  });

  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      setError(err.response?.data?.message || "Error retrieving tracking info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingData) {
      setLocations([
        {
          name: `Start: ${trackingData.from}`,
          lat: Number(trackingData.latitude),
          lng: Number(trackingData.longitude),
          icon: "https://www.nicepng.com/png/full/9-94335_location-icon-location-icon-png-blue.png", // Start Icon
        },
        {
          name: `Current: ${trackingData.current}`,
          lat: Number(trackingData.currentLatitude),
          lng: Number(trackingData.currentLongitude),
          icon: "https://media.tenor.com/9zntDQEnmEkAAAAi/point-of-interest-map.gif", // Current Location Icon
        },
        {
          name: `Destination: ${trackingData.destination}`,
          lat: Number(trackingData.destinationLatitude),
          lng: Number(trackingData.destinationLongitude),
          icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Destination Icon
        },
      ]);
    }
  }, [trackingData]);

  const defaultCenter =
    locations.length > 0
      ? { lat: locations[1].lat, lng: locations[1].lng } // Center map on current location
      : { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="cover">
      <div className="nav">
        <div>
          <Link to="/">
            <img
              src="https://www.ups.com/webassets/icons/logo.svg"
              className="logo"
            />
          </Link>
        </div>
        <div>
          <Link to="/login" className="button2">
            Track
          </Link>
        </div>
      </div>

      <div className="homepage">
        <div className="content">
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
                  <p className="Tnum">
                    Tracking Number: {trackingData.trackingNumber}
                  </p>

                  <div className="locationbox">
                    <div className="imgBox">
                      <img
                        src="https://www.nicepng.com/png/full/9-94335_location-icon-location-icon-png-blue.png"
                        className="icon"
                      />
                    </div>
                    <span className="locationtext">
                      <h5>Starting Point:</h5>
                      <p> {trackingData.from}</p>
                    </span>
                  </div>

                  <div className="locationbox">
                    <div className="imgBox">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                        className="icon"
                      />
                    </div>
                    <span className="locationtext">
                      <h5>Destination:</h5>
                      <p> {trackingData.destination}</p>
                    </span>
                  </div>

                  <div className="locationbox">
                    <div className="imgBox">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/016/774/636/original/3d-delivery-truck-icon-on-transparent-background-free-png.png"
                        className="icon"
                      />
                    </div>
                    <span className="locationtext">
                      <h5>Current Location:</h5>
                      <p> {trackingData.current}</p>
                    </span>
                  </div>

                  <div className="locationbox">
                    <div className="imgBox">
                      <img
                        src="https://cdn3.iconfinder.com/data/icons/camping-flat-colorful/614/2702_-_Distance-1024.png"
                        className="icon"
                      />
                    </div>
                    <span className="locationtext">
                      <h5>Distance Remaining:</h5>
                      <p> {trackingData.distanceRemaining}</p>
                    </span>
                  </div>
                </div>
              </div>
              <h2>Live Map</h2>

              <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={3}
                options={{
                  mapTypeControl: false, // Disable map type control
                  streetViewControl: false, // Disable the Street View (person icon)
                  fullscreenControl: true, // Optional: Disable fullscreen control
                  zoomControl: true, // Keep zoom control enabled
                }}
              >
                {/* ✅ Polyline (Blue) */}
                {locations.length > 0 && (
                  <Polyline
                    path={locations}
                    options={{
                      strokeColor: "gold",
                      strokeOpacity: 0.8,
                      strokeWeight: 6,
                    }}
                  />
                )}

                {/* ✅ Custom Markers */}
                {locations.map((location, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: Number(location.lat),
                      lng: Number(location.lng),
                    }}
                    icon={{
                      url: location.icon,
                      scaledSize: new window.google.maps.Size(50, 50), // Adjust size as needed
                    }}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))}

                {/* ✅ InfoWindow (Popup on Marker Click) */}
                {selectedLocation && (
                  <InfoWindow
                    position={{
                      lat: Number(selectedLocation.lat),
                      lng: Number(selectedLocation.lng),
                    }}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div style={{ padding: "5px", fontSize: "14px" }}>
                      <strong>{selectedLocation.name}</strong>
                      <br />
                      <span>
                        Lat: {Number(selectedLocation.lat).toFixed(4)}
                      </span>
                      <br />
                      <span>
                        Lng: {Number(selectedLocation.lng).toFixed(4)}
                      </span>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        Copyright ©1994-2025 United Parcel Service of America, Inc. All rights
        reserved.
      </div>
    </div>
  );
}
