import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminTrackingDashboard from "./AdminTrackingDashboard";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrackerForm, setShowTrackerForm] = useState(false);
  const navigate = useNavigate();

  // State for tracking input
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");

  // Location States - Stores formatted address and place names
  const [from, setFrom] = useState(""); // Full address
  const [fromName, setFromName] = useState(""); // Location name only
  const [destination, setDestination] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [current, setCurrent] = useState("");
  const [currentName, setCurrentName] = useState("");

  // State for storing selected locations' lat & long
  const [fromCoords, setFromCoords] = useState({ lat: "", lng: "" });
  const [destinationCoords, setDestinationCoords] = useState({ lat: "", lng: "" });
  const [currentCoords, setCurrentCoords] = useState({ lat: "", lng: "" });

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your API Key
    libraries: ["places"], // Load the 'places' library for Autocomplete
  });

  useEffect(() => {
    // Check if user is an admin; redirect to login if not
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    if (!adminStatus) navigate("/login");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare tracking data including place names
    const trackingData = {
      trackingNumber,
      courier,
      from,
      fromName,
      current,
      currentName,
      destination,
      destinationName,
      latitude: currentCoords.lat, // Use auto-filled latitude
      longitude: currentCoords.lng, // Use auto-filled longitude
    };

    try {
      const response = await fetch("https://back-one-navy.vercel.app/track/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Tracking information added successfully!");

      // Reset form fields
      setTrackingNumber("");
      setCourier("");
      setFrom("");
      setFromName("");
      setDestination("");
      setDestinationName("");
      setCurrent("");
      setCurrentName("");
      setFromCoords({ lat: "", lng: "" });
      setDestinationCoords({ lat: "", lng: "" });
      setCurrentCoords({ lat: "", lng: "" });

      setShowTrackerForm(false); // Hide form after submission
    } catch (error) {
      alert(error.message || "Failed to add tracking info.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="nav">
        <div><Link to="/"><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo"/></Link></div>
        <div><Link to="/login" className="button2">Tracks</Link></div>
      </div> 

      <div className="cover">
        <div className="homepage">
          <div className="content">
            <h1>Admin Dashboard</h1>
            
            {isAdmin ? (
              <div>
                <p>Welcome, Admin!</p>

                {/* Buttons Row - "View Users" and "Create Tracker" */}
                <div className="auth-links2">
                  <button onClick={() => navigate("/admin/users")} className="button">View Users</button>
                  <button onClick={() => setShowTrackerForm(!showTrackerForm)} className="button2">
                    {showTrackerForm ? "Hide Tracker Form" : "Create Tracker"}
                  </button>
                </div>

                {/* Tracking Form - Only shown when "Create Tracker" is clicked */}
                {showTrackerForm && isLoaded && (
                  <div className="trackform">
                    <h2>Add Tracking Information</h2>
                    <form onSubmit={handleSubmit}>
                      
                      {/* Courier Name */}
                      <input
                        type="text"
                        value={courier}
                        className="input"
                        onChange={(e) => setCourier(e.target.value)}
                        required
                      />
                      <label>Courier Name:</label><br/>
                      
                      {/* Tracking Number */}
                      <input
                        type="text"
                        value={trackingNumber}
                        className="input"
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                      />
                      <label>Tracking Number:</label><br/>

                      {/* Start Location (Auto-complete) */}
                      <Autocomplete
                        onLoad={(autocomplete) => (this.fromAutocomplete = autocomplete)}
                        onPlaceChanged={() => {
                          const place = this.fromAutocomplete.getPlace();
                          if (place.geometry) {
                            setFrom(place.formatted_address);
                            setFromName(place.name || place.formatted_address.split(",")[0]); // Extracts place name
                            setFromCoords({
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                          }
                        }}
                      >
                        <input type="text" className="input" value={from} onChange={(e) => setFrom(e.target.value)} required />
                      </Autocomplete>
                      <label>Start Location:</label><br/>

                      {/* Current Location (Auto-complete) */}
                      <Autocomplete
                        onLoad={(autocomplete) => (this.currentAutocomplete = autocomplete)}
                        onPlaceChanged={() => {
                          const place = this.currentAutocomplete.getPlace();
                          if (place.geometry) {
                            setCurrent(place.formatted_address);
                            setCurrentName(place.name || place.formatted_address.split(",")[0]);
                            setCurrentCoords({
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                          }
                        }}
                      >
                        <input type="text" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} required />
                      </Autocomplete>
                      <label>Current Location:</label><br/>

                      {/* Destination (Auto-complete) */}
                      <Autocomplete
                        onLoad={(autocomplete) => (this.destinationAutocomplete = autocomplete)}
                        onPlaceChanged={() => {
                          const place = this.destinationAutocomplete.getPlace();
                          if (place.geometry) {
                            setDestination(place.formatted_address);
                            setDestinationName(place.name || place.formatted_address.split(",")[0]);
                            setDestinationCoords({
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                          }
                        }}
                      >
                        <input type="text" className="input" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                      </Autocomplete>
                      <label>Destination:</label><br/>

                      {/* Submit Button */}
                      <button type="submit" className="button">Add Tracking Info</button>
                    </form>
                  </div>
                )}

                {/* Tracking Dashboard */}
                <AdminTrackingDashboard />
              </div>
            ) : (
              <p>Unauthorized access</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
    </div>
  );
}
