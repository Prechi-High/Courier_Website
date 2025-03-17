import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const AdminTrackingDashboard = () => {
  // State for tracking data
  const [trackings, setTrackings] = useState([]);
  const [editingTracking, setEditingTracking] = useState(null);

  // State for the form when editing
  const [formData, setFormData] = useState({
    current: "", // Current location name
    currentLatitude: "",
    currentLongitude: "",
    destination: "",
    destinationLatitude: "",
    destinationLongitude: "",
  });

  // Refs for Google Autocomplete
  const currentAutocompleteRef = useRef(null);
  const destinationAutocompleteRef = useRef(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AlzaSycB1plQTkXzVBd7pw5ZkaEnG7IHxWOdyhV", // Replace with your actual API key
    libraries: ["places"],
  });

  // Fetch all tracking data on component mount
  useEffect(() => {
    axios
      .get("https://back-one-navy.vercel.app/track/api/admin/trackings")
      .then((response) => {
        console.log("Tracking Data:", response.data); // Log API response
        setTrackings(response.data);
      })
      .catch((error) => console.error("Error fetching trackings:", error));
  }, []);

  // Handle clicking the edit button
  const handleEdit = (tracking) => {
    setEditingTracking(tracking.trackingNumber);
    setFormData({
      current: tracking.current || "",
      currentLatitude: tracking.currentLatitude || "",
      currentLongitude: tracking.currentLongitude || "",
      destination: tracking.destination || "",
      destinationLatitude: tracking.destinationLatitude || "",
      destinationLongitude: tracking.destinationLongitude || "",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle saving updated tracking info
  const handleSave = async () => {
    try {
      console.log("Sending Update Request for:", editingTracking);
      console.log("Payload:", formData);
  
      const response = await axios.put(
        `https://back-one-navy.vercel.app/track/api/admin/tracking/${editingTracking}`,
        formData
      );
  
      console.log("Update Response:", response.data);
      alert("Tracking updated!");
  
      // Fetch updated tracking data
      const updatedResponse = await axios.get(
        "https://back-one-navy.vercel.app/track/api/admin/trackings"
      );
      setTrackings(updatedResponse.data);
  
      setEditingTracking(null);
    } catch (error) {
      console.error("Error updating tracking:", error.response?.data || error);
    }
  };
  
  return (
    <div>
      <p style={{ fontSize: 30 }}>Product Tracking</p>
      <div className="Tablebox">
        <table border="1">
          <thead>
            <tr>
              <th>Courier</th>
              <th>Tracking Number</th>
              <th>Start Location</th>
              <th>Current Location</th>
              <th>Destination</th>
              <th>Distance Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map((tracking) => (
              <tr key={tracking.trackingNumber || index}>
                <td>{tracking.courier}</td>
                <td>{tracking.trackingNumber}</td>
                <td>{tracking.from}</td>
                <td>{tracking.current}</td>
                <td>{tracking.destination}</td>
                <td>{tracking.distanceRemaining ?? "N/A"}</td> {/* Fix for missing value */}
                <td>
                  {editingTracking === tracking.trackingNumber ? (
                    <>
                      {/* Current Location (Editable) */}
                      <Autocomplete
                        onLoad={(autocomplete) =>
                          (currentAutocompleteRef.current = autocomplete)
                        }
                        onPlaceChanged={() => {
                          const place = currentAutocompleteRef.current.getPlace();
                          if (place.geometry) {
                            setFormData({
                              ...formData,
                              current: place.formatted_address,
                              currentLatitude: place.geometry.location.lat(),
                              currentLongitude: place.geometry.location.lng(),
                            });
                          }
                        }}
                      >
                        <input
                          type="text"
                          className="input"
                          value={formData.current}
                          onChange={handleChange}
                          name="current"
                          placeholder="Enter Current Location..."
                        />
                      </Autocomplete>

                      {/* Save Button */}
                      <button onClick={handleSave} className="adminbtn">
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(tracking)}
                      className="adminbtn"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTrackingDashboard;
