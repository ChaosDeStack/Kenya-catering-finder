export function getAverageRating(reviews, catererId) {
  const matches = reviews.filter((review) => review.catererId === catererId);
  if (matches.length === 0) return null;
  const total = matches.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / matches.length) * 10) / 10;
}

export function calculatePerGuest(budget, guests) {
  if (!budget || !guests || budget <= 0 || guests <= 0) return null;
  return Math.round(budget / guests);
}

export function filterCaterers(caterers, reviews, { cuisine, maxPrice, minRating }) {
  return caterers.filter((caterer) => {
    const matchesCuisine = cuisine === "all" || caterer.cuisine === cuisine;
    const matchesPrice = !maxPrice || caterer.pricePerGuest <= maxPrice;
    const rating = getAverageRating(reviews, caterer.id) || 0;
    return matchesCuisine && matchesPrice && rating >= minRating;
  });
}