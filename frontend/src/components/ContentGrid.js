import ContentCard from './ContentCard';
import './ContentGrid.css';

export default function ContentGrid({ items, emptyMessage = 'No content yet.' }) {
  if (!items.length) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="content-grid">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
