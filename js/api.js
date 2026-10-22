const BASE_URL = "http://localhost:3000";

export async function getCaterers() {
  const response = await fetch(`${BASE_URL}/caterers`);
  if (!response.ok) {
    throw new Error("Could not load caterers");
  }
  return response.json();
}

export async function getReviews() {
  const response = await fetch(`${BASE_URL}/reviews`);
  if (!response.ok) {
    throw new Error("Could not load reviews");
  }
  return response.json();
}