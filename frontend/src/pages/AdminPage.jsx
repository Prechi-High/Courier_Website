import { useEffect, useState, useRef } from "react";
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
    googleMapsApiKey:"AlzaSypbx4MnxFN2NK7q1OrnitgBuhq6H3kFGtV", // Secure API Key
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
      latitude: fromCoords.lat, // Corrected
      longitude: fromCoords.lng, // Corrected
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

      setShowTrackerForm(false); // Hide form after submission
    } catch (error) {
      setMessage(error.message || "Failed to add tracking info.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="nav">
        <div className="logobox"><Link to="/"><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo" /></Link>
        <div className="reciptBox"> <Link to="https://web-project2-eight.vercel.app/" className="button5">Issue Recipt</Link></div></div>
       <div><Link to="/login" className="button2">Tracks</Link> </div>
       </div>
     

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
                      {/* Courier Name */}
                      <input
                        type="text"
                        value={courier}
                        className="input"
                        onChange={(e) => setCourier(e.target.value)}
                        required
                        placeholder="Enter Courire name..."
                      /> <br/>
                    

                      {/* Tracking Number */}
                      <input
                        type="text"
                        value={trackingNumber}
                        className="input"
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        required
                        placeholder="Enter Tracking Number..."
                      />
                     

                      {/* Start Location */}
                   
                      <Autocomplete
                        onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = fromAutocompleteRef.current.getPlace();
                          if (place.geometry) {
                            setFrom(place.formatted_address);
                            setFromName(place.name || place.formatted_address.split(",")[0]);
                            setFromCoords({
                              lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng(),
                            });
                          }
                        }}
                      >
                        <input type="text" className="input" value={from} onChange={(e) => setFrom(e.target.value)}  placeholder="Enter Start location..." required /> 
                      </Autocomplete>
                  
                     

                      {/* Current Location */}
                      <Autocomplete
                        onLoad={(autocomplete) => (currentAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={() => {
                          const place = currentAutocompleteRef.current.getPlace();
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
                        <input type="text" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} required placeholder="Enter Current location..."/>
                      </Autocomplete>
                   

                      
                     {/* Destination Location Autocomplete */}
<Autocomplete
  onLoad={(autocomplete) => (destinationAutocompleteRef.current = autocomplete)}
  onPlaceChanged={() => {
    const place = destinationAutocompleteRef.current.getPlace();
    
    // Debugging: Log the entire place object
    console.log("Place Object:", place);

    if (place.geometry) {
      const formattedAddress = place.formatted_address || "";
      const placeName = place.name || formattedAddress.split(",")[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setDestination(formattedAddress);
      setDestinationName(placeName);
      setDestinationCoords({ lat, lng });

      console.log("Updated Destination Data:", {
        name: placeName,
        address: formattedAddress,
        lat,
        lng
      });
    } else {
      console.log("No geometry data found for the selected place.");
    }
  }}
>
  <input
    type="text"
    className="input"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    required
    placeholder="Enter Destination location..."
  />
</Autocomplete>


                      {/* Submit Button */}
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

      {/* Footer */}
      <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
    </div>
  );
}
