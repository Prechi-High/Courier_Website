// Frontend: React component for sending emails
// Install dependencies: npm install react react-dom

import React, { useState } from "react";

const EmailSender = () => {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(null);

    // Function to handle sending email
    const sendEmail = async () => {
        try {
            const response = await fetch("https://back-one-navy.vercel.app/auth/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: email, subject, message })
            });
            
            const data = await response.json();
            setStatus(data.success ? "Email sent successfully!" : "Failed to send email.");
        } catch (error) {
            setStatus("Error sending email.");
        }
    };

    return (
        <div>
            <h2>Send an Email</h2>
            <input type="email" placeholder="Recipient Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)}></textarea>
            <button onClick={sendEmail}>Send Email</button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default EmailSender;
