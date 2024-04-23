import { Link} from 'react-router-dom';
export default function Footer() {
    return (
        <footer>
            <hr></hr>
            <h2>Sign up to our newsletter to receive updates</h2>
            <p>Don't miss out on the latest news, offers, and exciting developments. Subscribe now for a front-row seat to all things new and noteworthy!</p>
            <div class='newsletter'>
                <input type="email" class='f-input'  placeholder="Email"   />
                <button class='f-btn'>Subscribe</button>
            </div>
            <div class='footer-route'>
                <ul class='footer-menu'>
                    <li><Link to='/login'>Login</Link></li>
                    <li><Link to='/register'>Register</Link></li>
                    <li><Link to='/login'>Contact</Link></li>
                    <li><Link target='_blank' to='https://jagangk.me/'>Author</Link></li>
                </ul>
            </div>

            <div class='social-route' >
            <ul class="social-menu">
              <li><a class='facebook'  href="#"><i class="fa fa-facebook"></i></a></li>
              <li><a class='twitter'  href="#"><i class="fa fa-twitter"></i></a></li>
              <li><a target='_blank' class='dribble'  href="https://github.com/jagangk"><i class="fa fa-github"></i></a></li>
              <li><a target='_blank' class='linkedin'  href="https://www.linkedin.com/in/jagan-vijayakumar-13a6a1221"><i class="fa fa-linkedin"></i></a></li>   
            </ul>
          </div>
    </footer>
    );
}





    