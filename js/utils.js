export function getAverageRating(reviews, catererId) {
  const matches = reviews.filter((review) => review.catererId === catererId);
  if (matches.length === 0) return null;
  const total = matches.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / matches.length) * 10) / 10;
}