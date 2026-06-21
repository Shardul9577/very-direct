import { Link } from 'react-router-dom';
import Logo from './Logo';
import SocialIcon from './SocialIcon';
import { BRAND_MOTTO, FOOTER_PAGES, FOOTER_SOCIALS } from '../constants/brand';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__logo-wrap">
              <Logo size="lg" />
            </Link>
            <p className="footer__motto">{BRAND_MOTTO}</p>
            <div className="footer__socials">
              {FOOTER_SOCIALS.map(({ platform, href }) => (
                <SocialIcon key={platform} platform={platform} href={href} />
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Pages</h3>
            <ul className="footer__links">
              {FOOTER_PAGES.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3 className="footer__heading">Follow Us</h3>
            <ul className="footer__links">
              {FOOTER_SOCIALS.map(({ platform, label, href }) => (
                <li key={platform}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Very Direct. All rights reserved.</p>
          <p className="footer__tagline">Speak honestly. Stay direct.</p>
        </div>
      </div>
    </footer>
  );
}
