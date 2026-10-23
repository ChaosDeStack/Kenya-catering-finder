import { describe, it, expect, beforeEach } from "vitest";
import {
  showMessage, renderCaterers, renderEvents, renderReviews, fillCatererSelect,
} from "../js/ui.js";

const caterers = [
  { id: 1, name: "Mama Pilau", cuisine: "Kenyan", location: "Nairobi", pricePerGuest: 650 },
  { id: 2, name: "Karibu Events", cuisine: "Continental", location: "Thika", pricePerGuest: 800 },
];
const reviews = [{ id: 1, catererId: 1, name: "Wanjiku", rating: 5, comment: "Great food" }];
const event = { id: 1, name: "Wedding", budget: 150000, guests: 200, perGuest: 750, status: "pending" };

beforeEach(() => {
  document.body.innerHTML = `
    <p id="status"></p>
    <div id="caterer-list"></div>
    <ul id="event-list"></ul>
    <ul id="review-list"></ul>
    <select id="review-caterer"></select>`;
});

describe("showMessage", () => {
  it("sets the text and the style class", () => {
    showMessage("status", "Hello", "error");
    const element = document.getElementById("status");
    expect(element.textContent).toBe("Hello");
    expect(element.className).toBe("error");
  });
});

describe("renderCaterers", () => {
  it("draws one card per caterer with ratings", () => {
    renderCaterers(caterers, reviews);
    expect(document.querySelectorAll(".card")).toHaveLength(2);
    expect(document.body.textContent).toContain("★ 5");
    expect(document.body.textContent).toContain("No reviews yet");
  });
});

describe("renderEvents", () => {
  it("shows a message when there are no events", () => {
    renderEvents([]);
    expect(document.getElementById("event-list").textContent).toContain("No saved events yet");
  });
  it("shows Edit, Confirm and Delete buttons", () => {
    renderEvents([event]);
    expect(document.querySelector(".btn-edit")).not.toBeNull();
    expect(document.querySelector(".btn-delete")).not.toBeNull();
    expect(document.querySelector(".btn-confirm").textContent).toBe("Confirm");
  });
  it("shows Unconfirm for confirmed events", () => {
    renderEvents([{ ...event, status: "confirmed" }]);
    expect(document.querySelector(".btn-confirm").textContent).toBe("Unconfirm");
  });
});

describe("renderReviews", () => {
  it("shows a message when there are no reviews", () => {
    renderReviews([], caterers);
    expect(document.getElementById("review-list").textContent).toContain("No reviews yet");
  });
  it("shows the caterer's name and the comment", () => {
    renderReviews(reviews, caterers);
    expect(document.getElementById("review-list").textContent).toContain("Mama Pilau");
    expect(document.getElementById("review-list").textContent).toContain("Great food");
  });
});

describe("fillCatererSelect", () => {
  it("adds a placeholder plus one option per caterer", () => {
    fillCatererSelect(caterers);
    expect(document.querySelectorAll("#review-caterer option")).toHaveLength(3);
  });
});