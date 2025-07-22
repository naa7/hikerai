import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating }) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return null;
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex flex-row text-md mb-3 items-center">
      <strong className="mr-2">Rating:</strong>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <FaStar key={i} color="#ffc107" className="align-middle" />
        ))}
      {halfStar && <FaStarHalfAlt color="#ffc107" className="align-middle" />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <FaRegStar key={i} color="#ffc107" className="align-middle" />
        ))}
    </div>
  );
};

export default RatingStars;
