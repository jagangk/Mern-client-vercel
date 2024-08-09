import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <>
      <footer>
        <div className="footer-div">
          <h2>Sign up to our newsletter to receive updates!</h2>
          <p>
            Don't miss out on the latest news and exciting developments.
            Subscribe now to receive newsletter!
          </p>
        </div>
        <div className="newsletter">
          <input type="email" className="f-input" placeholder="Email" />
          <button className="f-btn">Subscribe</button>
        </div>
        <div className="footer-route">
          <ul className="footer-menu">
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="https://www.api.blogstera.site/sitemap.xml">
                Sitemap
              </Link>
            </li>
            <li>
              <Link to="/about">Policies</Link>
            </li>
            <li>
              <Link target="_blank" to="https://www.api.blogstera.site/rss">
                Feeds
              </Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="social-route">
          <ul className="social-menu">
            <li>
              <a className="facebook" href="/">
                <i className="fa fa-facebook"></i>
              </a>
            </li>
            <li>
              <a className="twitter" href="/">
                <i className="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a className="dribble" href="https://github.com/jagangk">
                <i className="fa fa-github"></i>
              </a>
            </li>
            <li>
              <a
                className="linkedin"
                href="https://www.linkedin.com/in/jagan-vijayakumar-13a6a1221"
              >
                <i className="fa fa-linkedin"></i>
              </a>
            </li>
          </ul>
        </div>
        <p className="copyright-info">© 2024 Blogstera. All rights reserved.</p>
      </footer>
    </>
  );
}
