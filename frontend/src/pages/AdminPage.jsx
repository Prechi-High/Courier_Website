import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminTrackingDashboard from "./AdminTrackingDashboard";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import "./Navbar.css"; // Import CSS for styling

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrackerForm, setShowTrackerForm] = useState(false);
  const navigate = useNavigate();

  // Navbar State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle navbar menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // State for tracking input
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [message, setMessage] = useState("");

  // State for locations and coordinates
  const [from, setFrom] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromCoords, setFromCoords] = useState({ lat: "", lng: "" });

  const [current, setCurrent] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentCoords, setCurrentCoords] = useState({ lat: "", lng: "" });

  const [destination, setDestination] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationCoords, setDestinationCoords] = useState({ lat: "", lng: "" });

  // Refs for Autocomplete
  const fromAutocompleteRef = useRef(null);
  const currentAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AlzaSypbx4MnxFN2NK7q1OrnitgBuhq6H3kFGtV", // Secure API Key
    libraries: ["places"],
  });

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    if (!adminStatus) navigate("/login");
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trackingData = {
      trackingNumber,
      latitude: fromCoords.lat,
      longitude: fromCoords.lng,
      courier,
      currentLatitude: currentCoords.lat,
      currentLongitude: currentCoords.lng,
      destinationLatitude: destinationCoords.lat,
      destinationLongitude: destinationCoords.lng,
      from: fromName,
      current: currentName,
      destination: destinationName,
    };
    console.log("Final Payload:", trackingData);

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

      setMessage("Tracking information added successfully!");
      setTrackingNumber("");
      setCourier("");
      setFrom("");
      setFromName("");
      setFromCoords({ lat: "", lng: "" });

      setCurrent("");
      setCurrentName("");
      setCurrentCoords({ lat: "", lng: "" });

      setDestination("");
      setDestinationName("");
      setDestinationCoords({ lat: "", lng: "" });

      setShowTrackerForm(false);
    } catch (error) {
      setMessage(error.message || "Failed to add tracking info.");
    }
  };

  // Navbar Function
  const Navbar = () => (
    <nav className="navbar">
     
    
      <Link to="/" ><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo"/></Link>
      <div className="nav-container">
        {/* Hamburger Icon */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
     
        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <li><Link to="https://web-project2-eight.vercel.app" onClick={toggleMenu}>ISSUE RECIPT</Link></li>
          <li><Link to="/email" onClick={toggleMenu}>SEND EMAIL</Link></li>
          <li><Link to="/login"  onClick={toggleMenu}>TRACK</Link></li>
          
        </ul>
      </div>
    </nav>
  );

  return (
    <div>
      <Navbar />

      <div className="cover">
        <div className="homepage">
          <div className="content">
            <h1>Admin Dashboard</h1>
            {isAdmin ? (
              <div>
                <p>Welcome, Admin!</p>

                {/* Buttons Row */}
                <div className="auth-links2">
                  <button onClick={() => navigate("/admin/users")} className="button">View Users</button>
                  <button onClick={() => setShowTrackerForm(!showTrackerForm)} className="button2">
                    {showTrackerForm ? "Hide Tracker Form" : "Create Tracker"}
                  </button>
                </div>

                {/* Tracking Form */}
                {showTrackerForm && isLoaded && (
                  <div className="trackform">
                    <form onSubmit={handleSubmit}>
                      <h2>Add Tracking Information</h2>
                      <input type="text" value={courier} className="input" onChange={(e) => setCourier(e.target.value)} required placeholder="Enter Courier name..." />
                      <input type="text" value={trackingNumber} className="input" onChange={(e) => setTrackingNumber(e.target.value)} required placeholder="Enter Tracking Number..." />

                      <Autocomplete
                        onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = fromAutocompleteRef.current.getPlace();
                          if (place.geometry) {
                            setFrom(place.formatted_address);
                            setFromName(place.name || place.formatted_address.split(",")[0]);
                            setFromCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                          }
                        }}
                      >
                        <input type="text" className="input" value={from} onChange={(e) => setFrom(e.target.value)} required placeholder="Enter Start location..." />
                      </Autocomplete>

                      <Autocomplete
                        onLoad={(autocomplete) => (currentAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = currentAutocompleteRef.current.getPlace();
                          if (place.geometry) {
                            setCurrent(place.formatted_address);
                            setCurrentName(place.name || place.formatted_address.split(",")[0]);
                            setCurrentCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                          }
                        }}
                      >
                        <input type="text" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} required placeholder="Enter Current location..." />
                      </Autocomplete>

                      <Autocomplete
                        onLoad={(autocomplete) => (destinationAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = destinationAutocompleteRef.current.getPlace();
                          if (place.geometry) {
                            setDestination(place.formatted_address);
                            setDestinationName(place.name || place.formatted_address.split(",")[0]);
                            setDestinationCoords({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                          }
                        }}
                      >
                        <input type="text" className="input" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Enter Destination location..." />
                      </Autocomplete>

                      <button type="submit" className="button">Add Tracking Info</button>
                    </form>

                    {message && <p>{message}</p>}
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
    </div>
  );
}
