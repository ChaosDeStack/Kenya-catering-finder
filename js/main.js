import {
  getCaterers, getReviews, getEvents,
  createEvent, updateEvent, patchEvent, deleteEvent, createReview,
} from "./api.js";
import {
  renderCaterers, renderEvents, renderReviews, fillCatererSelect, showMessage,
} from "./ui.js";
import {
  calculatePerGuest, filterCaterers, validateEvent, validateReview,
} from "./utils.js";

let allCaterers = [];
let allReviews = [];
let allEvents = [];
let editingId = null;

function applyFilters() {
  const filters = {
    cuisine: document.getElementById("cuisine-filter").value,
    maxPrice: Number(document.getElementById("max-price").value),
    minRating: Number(document.getElementById("min-rating").value),
  };
  const results = filterCaterers(allCaterers, allReviews, filters);
  renderCaterers(results, allReviews);
  showMessage("status", results.length === 0 ? "No caterers match your filters." : "");
}

function handleCalculate(event) {
  event.preventDefault();
  const budget = Number(document.getElementById("budget").value);
  const guests = Number(document.getElementById("guests").value);
  const perGuest = calculatePerGuest(budget, guests);

  if (perGuest === null) {
    showMessage("per-guest-result", "Please enter a budget and guests above 0.", "error");
    return;
  }
  showMessage("per-guest-result", `KES ${perGuest} per guest`);
  document.getElementById("max-price").value = perGuest;
  applyFilters();
}

function clearFilters() {
  document.getElementById("cuisine-filter").value = "all";
  document.getElementById("max-price").value = "";
  document.getElementById("min-rating").value = "0";
  applyFilters();
}

function readEventForm() {
  return {
    name: document.getElementById("event-name").value.trim(),
    budget: Number(document.getElementById("budget").value),
    guests: Number(document.getElementById("guests").value),
  };
}

function resetEventForm() {
  document.getElementById("budget-form").reset();
  document.getElementById("save-event").textContent = "Save event";
  editingId = null;
}

async function handleSaveEvent() {
  const form = readEventForm();
  const problem = validateEvent(form);
  if (problem) {
    showMessage("per-guest-result", problem, "error");
    return;
  }
  const perGuest = calculatePerGuest(form.budget, form.guests);

  try {
    if (editingId) {
      const old = allEvents.find((item) => String(item.id) === String(editingId));
      const updated = await updateEvent(editingId, { ...form, perGuest, status: old.status });
      allEvents = allEvents.map((item) => (String(item.id) === String(editingId) ? updated : item));
      showMessage("per-guest-result", "Event updated!", "success");
    } else {
      const saved = await createEvent({ ...form, perGuest, status: "pending" });
      allEvents.push(saved);
      showMessage("per-guest-result", "Event saved!", "success");
    }
    renderEvents(allEvents);
    resetEventForm();
  } catch (error) {
    showMessage("per-guest-result", "Could not save the event. Try again.", "error");
  }
}

async function handleEventClick(event) {
  const item = event.target.closest("li");
  if (!item || !item.dataset.id) return;
  const id = item.dataset.id;
  const current = allEvents.find((entry) => String(entry.id) === id);

  try {
    if (event.target.closest(".btn-delete")) {
      await deleteEvent(id);
      allEvents = allEvents.filter((entry) => String(entry.id) !== id);
      renderEvents(allEvents);
    } else if (event.target.closest(".btn-confirm")) {
      const status = current.status === "confirmed" ? "pending" : "confirmed";
      const updated = await patchEvent(id, { status });
      allEvents = allEvents.map((entry) => (String(entry.id) === id ? updated : entry));
      renderEvents(allEvents);
    } else if (event.target.closest(".btn-edit")) {
      document.getElementById("event-name").value = current.name;
      document.getElementById("budget").value = current.budget;
      document.getElementById("guests").value = current.guests;
      document.getElementById("save-event").textContent = "Update event";
      editingId = id;
      showMessage("per-guest-result", "Editing: change the details, then click Update event.");
    }
  } catch (error) {
    showMessage("status", "Something went wrong. Please try again.", "error");
  }
}

async function handleReviewSubmit(event) {
  event.preventDefault();
  const review = {
    catererId: Number(document.getElementById("review-caterer").value),
    rating: Number(document.getElementById("review-rating").value),
    name: document.getElementById("review-name").value.trim(),
    comment: document.getElementById("review-comment").value.trim(),
  };

  const problem = validateReview(review);
  if (problem) {
    showMessage("review-status", problem, "error");
    return;
  }

  try {
    const saved = await createReview(review);
    allReviews.push(saved);
    renderReviews(allReviews, allCaterers);
    applyFilters();
    document.getElementById("review-form").reset();
    showMessage("review-status", "Thank you for your review!", "success");
  } catch (error) {
    showMessage("review-status", "Could not save your review. Try again.", "error");
  }
}

async function init() {
  showMessage("status", "Loading caterers...", "loading");
  try {
    [allCaterers, allReviews, allEvents] = await Promise.all([
      getCaterers(), getReviews(), getEvents(),
    ]);
    fillCatererSelect(allCaterers);
    applyFilters();
    renderEvents(allEvents);
    renderReviews(allReviews, allCaterers);
  } catch (error) {
    showMessage("status", "Could not load data. Is the server running?", "error");
  }
}

document.getElementById("budget-form").addEventListener("submit", handleCalculate);
document.getElementById("cuisine-filter").addEventListener("change", applyFilters);
document.getElementById("max-price").addEventListener("input", applyFilters);
document.getElementById("min-rating").addEventListener("change", applyFilters);
document.getElementById("clear-filters").addEventListener("click", clearFilters);
document.getElementById("save-event").addEventListener("click", handleSaveEvent);
document.getElementById("event-list").addEventListener("click", handleEventClick);
document.getElementById("review-form").addEventListener("submit", handleReviewSubmit);
init();