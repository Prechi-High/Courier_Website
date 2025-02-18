import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true)
      const response = await axios.post("https://back-one-navy.vercel.app/auth/signup", {userName, email, password });
      
      alert("User registered successfully!");

     
        navigate("/login");  // ✅ Redirect  User to login Page
      
      console.log("Response:", response.data);
    } catch (error) {
      setLoading(false)
      console.error("Signup Error:", error);
      alert(error.response?.data?.message || "An error occurred. Check console for details.");
    }
  };
  return (
   
<div>
    <div className="nav">
    <div><Link to="/" ><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo"/></Link></div>
    <div> <Link to="/login" className="button2">Track</Link></div>
  </div>

<div className="cover">
<div className="homepage">
  <div className="content">
  <form onSubmit={handleSignup}>
  <h1>Sign up</h1>
      <input type="userName" onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="input" /><br/>
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input"/><br/>
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input" /><br/>
      <button type="submit" className="subbtn">{loading? 'Submitting...' : 'Sign up' }</button>

      <div className="auth-links">
           <p>have an account? <Link to="/login" className="but"> Login</Link> instead</p>
        </div>
    </form>

  
  </div>
</div>
</div>
<div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
</div>
  );
}
