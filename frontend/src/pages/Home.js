import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../services/api';
import MixedContentRow from '../components/MixedContentRow';
import { BRAND_MOTTO, INSTAGRAM_URL } from '../constants/brand';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      contentApi.getAll({ featured: 'true' }),
      contentApi.getAll({ trending: 'true' }),
    ])
      .then(([f, t]) => {
        setFeatured(f);
        setTrending(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading...</div>;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />

        <div className="hero__content">
          <h1 className="hero__title">Very Direct</h1>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero__badge"
          >
            @verydirectt on Instagram
          </a>

          <p className="hero__motto">{BRAND_MOTTO}</p>

          <div className="hero__cta">
            <Link to="/videos" className="hero__btn hero__btn--primary">
              Watch Videos
            </Link>
            <Link to="/blogs" className="hero__btn hero__btn--ghost">
              Read Blogs
            </Link>
          </div>
        </div>
      </section>

      <div className="home__body">
        <section className="section">
          <div className="section-header">
            <h2>Featured</h2>
            <span className="section-line" />
          </div>
          <MixedContentRow items={featured} emptyMessage="No featured content yet." />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Trending</h2>
            <span className="section-line" />
          </div>
          <MixedContentRow items={trending} emptyMessage="No trending content yet." />
        </section>
      </div>
    </div>
  );
}
