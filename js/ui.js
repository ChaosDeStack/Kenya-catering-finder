import { getAverageRating } from "./utils.js";

export function showMessage(elementId, text, type = "") {
  const element = document.getElementById(elementId);
  element.textContent = text;
  element.className = type;
}

export function renderCaterers(caterers, reviews) {
  const list = document.getElementById("caterer-list");
  list.innerHTML = "";

  caterers.forEach((caterer) => {
    const rating = getAverageRating(reviews, caterer.id);
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-photo">Photo</div>
      <div class="card-body">
        <h3>${caterer.name}</h3>
        <p>${caterer.cuisine} · ${caterer.location}</p>
        <p class="rating">${rating ? "★ " + rating : "No reviews yet"}</p>
        <p><strong>KES ${caterer.pricePerGuest}</strong> per guest</p>
        <div class="card-actions">
          <button type="button" class="btn-save">Save</button>
          <button type="button" class="btn-outline">Details</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

export function renderEvents(events) {
  const list = document.getElementById("event-list");
  list.innerHTML = "";

  if (events.length === 0) {
    list.innerHTML = "<li>No saved events yet.</li>";
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("li");
    item.dataset.id = event.id;

    const info = document.createElement("span");
    info.textContent = `${event.name} · KES ${event.budget} for ${event.guests} guests (KES ${event.perGuest} per guest) · ${event.status}`;

    const actions = document.createElement("span");
    actions.className = "card-actions";
    actions.innerHTML = `
      <button type="button" class="btn-edit btn-outline">Edit</button>
      <button type="button" class="btn-confirm">${event.status === "confirmed" ? "Unconfirm" : "Confirm"}</button>
      <button type="button" class="btn-delete">Delete</button>
    `;

    item.append(info, actions);
    list.appendChild(item);
  });
}

export function renderReviews(reviews, caterers) {
  const list = document.getElementById("review-list");
  list.innerHTML = "";

  if (reviews.length === 0) {
    list.innerHTML = "<li>No reviews yet.</li>";
    return;
  }

  reviews.forEach((review) => {
    const caterer = caterers.find((item) => item.id === review.catererId);
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${caterer ? caterer.name : "Unknown caterer"} · ★ ${review.rating} · ${review.name}: ${review.comment}`;
    item.append(text);
    list.appendChild(item);
  });
}

export function fillCatererSelect(caterers) {
  const select = document.getElementById("review-caterer");
  select.innerHTML = '<option value="">Choose a caterer</option>';
  caterers.forEach((caterer) => {
    const option = document.createElement("option");
    option.value = caterer.id;
    option.textContent = caterer.name;
    select.appendChild(option);
  });
}