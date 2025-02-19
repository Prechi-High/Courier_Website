
import { Link } from "react-router-dom";
import { useEffect } from "react";


export default function Home() {
  // Function to handle image loading with blur effect
  //vercel.json rewrites avoid 404 on refresh
  useEffect(() => {
    const blurDivs = document.querySelectorAll(".blur-load");
    blurDivs.forEach((div) => {
      const img = div.querySelector("img");
      if (img) {
        const loaded = () => {
          div.classList.add("loaded");
        };
        if (img.complete) {
          loaded();
        } else {
          img.addEventListener("load", loaded);
        }
      }
    });
  }, []);

  return (
    <div>
    <div className="nav">
    <div><Link to="/" ><img src="https://www.ups.com/webassets/icons/logo.svg" className="logo"/></Link></div>
    <div> <Link to="/login" className="button2">Track</Link></div>
  </div>
    <div className="cover">
      <div className="homepage">
        <div className="content">
       
        <div className="Hero">
          <div>
          <h1>Delivering Excellence,<br />One Package at a Time</h1>
          <h2>Your trusted partner in timely and secure deliveries across the nation</h2>
          <div className="Heroimage"><img src="https://www.ups.com/us/en/media_1183b394323caf0254f26c093eb934df7a4a8eb89.webp?width=750&format=webply&optimize=medium"/></div>
          <p className="track-info">Login or create an account to track package</p>
          <div className="auth-links">
            <Link to="/signup" className="button2">Create Account</Link>
            <Link to="/login" className="button">Login</Link>
          </div>
          </div>
         
          </div>
          <section className="success-stories">
            <div className="customer-images">
              <div className="blur-load" style={{ backgroundImage: "url('/path-to-tiny-image1.jpg')" }}>
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=48&h=48&q=80"
                  alt="Customer 1"
                  className="customer-image"
                  loading="lazy"
                />
              </div>
              <div className="blur-load" style={{ backgroundImage: "url('/path-to-tiny-image2.jpg')" }}>
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=48&h=48&q=80"
                  alt="Customer 2"
                  className="customer-image"
                  loading="lazy"
                />
              </div>
              <div className="blur-load" style={{ backgroundImage: "url('/path-to-tiny-image3.jpg')" }}>
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=48&h=48&q=80"
                  alt="Customer 3"
                  className="customer-image"
                  loading="lazy"
                />
              </div>
              <span>Over 2000+ Successful Shippings</span>
            </div>
          </section>

        
        </div>
      </div>
    </div>
    <div className="footer">Copyright ©1994-2025 United Parcel Service of America, Inc. All rights reserved.</div>
    </div>
  );
}
