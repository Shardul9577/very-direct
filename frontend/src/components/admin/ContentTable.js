import './ContentTable.css';

export default function ContentTable({ items, onToggle, onDelete, emptyMessage }) {
  if (!items.length) {
    return <div className="dash-empty">{emptyMessage}</div>;
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Featured</th>
            <th>Trending</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="dash-table__content">
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt="" className="dash-table__thumb" />
                  )}
                  <div>
                    <strong>{item.title}</strong>
                    <small>{new Date(item.createdAt).toLocaleDateString()}</small>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className={`dash-toggle ${item.featured ? 'on' : 'off'}`}
                  onClick={() => onToggle(item.id, 'featured')}
                >
                  {item.featured ? 'ON' : 'OFF'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={`dash-toggle ${item.trending ? 'on' : 'off'}`}
                  onClick={() => onToggle(item.id, 'trending')}
                >
                  {item.trending ? 'ON' : 'OFF'}
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="dash-delete"
                  onClick={() => onDelete(item.id, item.title)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
