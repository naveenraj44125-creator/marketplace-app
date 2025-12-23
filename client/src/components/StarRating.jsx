export default function StarRating({ rating, onRate }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate?.(star)}
          style={{ cursor: onRate ? 'pointer' : 'default' }}
        >
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}
