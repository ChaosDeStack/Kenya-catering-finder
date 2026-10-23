import { getCaterers, getReviews, getEvents, createEvent, deleteEvent } from "./api.js";
import { renderCaterers, renderEvents, showMessage } from "./ui.js";
import { calculatePerGuest, filterCaterers } from "./utils.js";

let allCaterers = [];
let allReviews = [];
let allEvents = [];

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

async function handleSaveEvent() {
    const name = document.getElementById("event-name").value.trim();
    const budget = Number(document.getElementById("budget").value);
    const guests = Number(document.getElementById("guests").value);
    const perGuest = calculatePerGuest(budget, guests);

    if (!name || perGuest === null) {
        showMessage("per-guest-result", "Enter an event name, budget and guests first.", "error");
        return;
    }

    try {
        const saved = await createEvent({ name, budget, guests, perGuest, status: "pending" });
        allEvents.push(saved);
        renderEvents(allEvents);
        showMessage("per-guest-result", "Event saved!", "success");
    } catch (error) {
        showMessage("per-guest-result", "Could not save the event. Try again.", "error");
    }
}

async function handleEventClick(event) {
    const button = event.target.closest(".btn-delete");
    if (!button) return;
    const id = button.closest("li").dataset.id;

    try {
        await deleteEvent(id);
        allEvents = allEvents.filter((item) => String(item.id) !== id);
        renderEvents(allEvents);
    } catch (error) {
        showMessage("status", "Could not delete the event.", "error");
    }
}

async function init() {
    showMessage("status", "Loading caterers...", "loading");
    try {
        [allCaterers, allReviews, allEvents] = await Promise.all([getCaterers(), getReviews(), getEvents()]);
        applyFilters();
        renderEvents(allEvents);
    } catch (error) {
        showMessage("status", "Could not load caterers. Is the server running?", "error");
    }
}

document.getElementById("budget-form").addEventListener("submit", handleCalculate);
document.getElementById("cuisine-filter").addEventListener("change", applyFilters);
document.getElementById("max-price").addEventListener("input", applyFilters);
document.getElementById("min-rating").addEventListener("change", applyFilters);
document.getElementById("clear-filters").addEventListener("click", clearFilters);
document.getElementById("event-list").addEventListener("click", handleEventClick);
document.getElementById("save-event").addEventListener("click", handleSaveEvent);
init();