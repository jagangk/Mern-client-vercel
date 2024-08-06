import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  return (
    <div className="home-index">
      <div className="navbar-toggle" >
        <h2>Feeds</h2>
        <button className="navbar-btn" onClick={toggleNavbar}>
          ☰
        </button>
      </div>

      <div className={`promo ${isNavbarVisible ? "show" : ""}`}>
        <div className="index-promo">
          <Link
            target="_blank"
            to="https://news.google.com/publications/CAAqBwgKMILszQswsoflAw?ceid=IN:en&oc=3"
          >
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="google.png" />
              <p>Follow on Google</p>
            </div>
          </Link>

          <Link to="/create">
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="create.png" />
              <p>New Post</p>
            </div>
          </Link>

         
        </div>

        <div className="index-promo">
          <Link to="/PlagGuard">
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="blog-ai.png" />
              <p>PlagGuard</p>
            </div>
          </Link>

          <Link to="/safecontent">
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="safe.png" />
              <p>SafeContent</p>
            </div>
          </Link>
        </div>

        <div className="index-promo">
    
          <Link
            to="/about"
          >
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="policy.png" />
              <p>Privacy Policy</p>
            </div>
          </Link>

          <Link to="/about">
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="about.png" />
              <p>About</p>
            </div>
          </Link>

          <Link to="/contact">
            <div className="gicon-title">
              <img alt="ai logo" className="promo-icon" src="mail.png" />
              <p>Contact</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
