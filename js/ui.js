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
    info.textContent = `${event.name} · KES ${event.budget} for ${event.guests} guests (KES ${event.perGuest} per guest)`;

    const actions = document.createElement("span");
    actions.className = "card-actions";
    actions.innerHTML = `<button type="button" class="btn-delete">Delete</button>`;

    item.append(info, actions);
    list.appendChild(item);
  });
}