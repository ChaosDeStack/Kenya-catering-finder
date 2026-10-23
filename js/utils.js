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

export function validateEvent({ name, budget, guests }) {
  if (!name || name.trim().length < 2) return "Event name must be at least 2 characters.";
  if (!Number.isFinite(budget) || budget <= 0) return "Budget must be a number above 0.";
  if (!Number.isInteger(guests) || guests <= 0) return "Guests must be a whole number above 0.";
  return "";
}

export function validateReview({ name, comment, catererId }) {
  if (!catererId) return "Please choose a caterer.";
  if (!name || name.trim().length < 2) return "Please enter your name.";
  if (!comment || comment.trim().length < 5) return "Comment must be at least 5 characters.";
  return "";
}