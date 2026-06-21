import { LOGO_SRC } from '../constants/brand';
import './Logo.css';

const SIZES = {
  xs: 28,
  sm: 36,
  nav: 54,
  md: 44,
  lg: 88,
  xl: 120,
  hero: 150,
};

export default function Logo({ size = 'md', className = '', avatar = false, variant = 'default' }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Very Direct"
      className={[
        'logo',
        `logo--${size}`,
        avatar && 'logo--avatar',
        variant !== 'default' && `logo--${variant}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height: SIZES[size] || SIZES.md }}
    />
  );
}
