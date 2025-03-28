import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Link } from "react-router-dom";
import axios from "axios";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
 
  // Navbar State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle navbar menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();
  // "proxy": "https://back-one-navy.vercel.app",

  useEffect(() => {
    fetchUsers();
    fetchTrackings();
  }, []);

  const fetchUsers = () => {
    axios.get("https://back-one-navy.vercel.app/track/admin/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchTrackings = () => {
    axios.get("https://back-one-navy.vercel.app/track/admin/trackings")
      .then((response) => setTrackingData(response.data))
      .catch((error) => console.error("Error fetching tracking data:", error));
  };

  // ✅ Delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This will remove all their data.")) {
      try {
     
        await axios.delete(`https://back-one-navy.vercel.app/track/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setTrackingData(trackingData.filter(track => track.user !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // ✅ Delete a tracking record
  const handleDeleteTracking = async (trackingId) => {
    if (window.confirm("Are you sure you want to delete this tracking record?")) {
      try {
        
        await axios.delete(`https://back-one-navy.vercel.app/track/admin/trackings/${trackingId}`);
        setTrackingData(trackingData.filter(track => track._id !== trackingId));
      } catch (error) {
        console.error("Error deleting tracking record:", error);
      }
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
      <h1>Admin - User Management</h1>
      <button onClick={() => navigate("/admin")} className="adminbtn">Back to Dashboard</button>

      {/* User Information Table */}
      <h2>User Information</h2>
    <div className="Tablebox">

      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}  className="adminbtn">
                 Delete user
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      {/* Tracking Information Table */}
      <h2>Tracking Information</h2>
<div className="Tablebox">

      <table border="1">
        <thead>
          <tr>
            
            <th>Courier</th>
            <th>Tracking Number</th>
            <th>Current Location</th>
            <th>Destination</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackingData.length > 0 ? (
            trackingData.map((track) => (
              <tr key={track._id}>
                
                <td>{track.courier || "N/A"}</td>
                <td>{track.trackingNumber || "N/A"}</td>
                <td>{track.current || "N/A"}</td>
                <td>{track.destination || "N/A"}</td>
                <td>
                  <button onClick={() => handleDeleteTracking(track._id)} className="adminbtn">
                  Delete Tracking
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No tracking data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
    <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
    </div>
  );
}
