import { getCaterers, getReviews, getEvents, createEvent, deleteEvent } from "./api.js";
import { renderCaterers, renderEvents, showMessage } from "./ui.js";
import { calculatePerGuest, filterCaterers } from "./utils.js";

let allCaterers = [];
let allReviews = [];

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

async function init() {
  showMessage("status", "Loading caterers...", "loading");
  try {
    [allCaterers, allReviews] = await Promise.all([getCaterers(), getReviews()]);
    applyFilters();
  } catch (error) {
    showMessage("status", "Could not load caterers. Is the server running?", "error");
  }
}

document.getElementById("budget-form").addEventListener("submit", handleCalculate);
document.getElementById("cuisine-filter").addEventListener("change", applyFilters);
document.getElementById("max-price").addEventListener("input", applyFilters);
document.getElementById("min-rating").addEventListener("change", applyFilters);
document.getElementById("clear-filters").addEventListener("click", clearFilters);

init();