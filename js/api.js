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

export async function getEvents() {
  const response = await fetch(`${BASE_URL}/events`);
  if (!response.ok) throw new Error("Could not load events");
  return response.json();
}

export async function createEvent(eventData) {
  const response = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) throw new Error("Could not save event");
  return response.json();
}

export async function deleteEvent(id) {
  const response = await fetch(`${BASE_URL}/events/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Could not delete event");
}