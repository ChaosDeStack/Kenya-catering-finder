import { describe, it, expect } from "vitest";
import {
  getAverageRating, calculatePerGuest, filterCaterers, validateEvent, validateReview,
} from "../js/utils.js";

const caterers = [
  { id: 1, cuisine: "Kenyan", pricePerGuest: 650 },
  { id: 2, cuisine: "Indian", pricePerGuest: 950 },
  { id: 3, cuisine: "Kenyan", pricePerGuest: 450 },
];
const reviews = [
  { catererId: 1, rating: 5 },
  { catererId: 1, rating: 4 },
  { catererId: 3, rating: 5 },
];

describe("getAverageRating", () => {
  it("averages the ratings for one caterer", () => {
    expect(getAverageRating(reviews, 1)).toBe(4.5);
  });
  it("returns null when there are no reviews", () => {
    expect(getAverageRating(reviews, 2)).toBeNull();
  });
});

describe("calculatePerGuest", () => {
  it("divides budget by guests", () => {
    expect(calculatePerGuest(150000, 200)).toBe(750);
  });
  it("returns null for zero or missing values", () => {
    expect(calculatePerGuest(0, 10)).toBeNull();
    expect(calculatePerGuest(1000, 0)).toBeNull();
    expect(calculatePerGuest(undefined, 5)).toBeNull();
  });
});

describe("filterCaterers", () => {
  const none = { cuisine: "all", maxPrice: 0, minRating: 0 };
  it("returns everyone when no filter is set", () => {
    expect(filterCaterers(caterers, reviews, none)).toHaveLength(3);
  });
  it("filters by cuisine", () => {
    const result = filterCaterers(caterers, reviews, { ...none, cuisine: "Kenyan" });
    expect(result).toHaveLength(2);
  });
  it("filters by max price", () => {
    const result = filterCaterers(caterers, reviews, { ...none, maxPrice: 500 });
    expect(result.map((c) => c.id)).toEqual([3]);
  });
  it("filters by minimum rating", () => {
    const result = filterCaterers(caterers, reviews, { ...none, minRating: 5 });
    expect(result.map((c) => c.id)).toEqual([3]);
  });
});

describe("validateEvent", () => {
  it("accepts a good event", () => {
    expect(validateEvent({ name: "Wedding", budget: 150000, guests: 200 })).toBe("");
  });
  it("rejects a short name", () => {
    expect(validateEvent({ name: "", budget: 1000, guests: 10 })).toMatch(/name/i);
  });
  it("rejects a bad budget", () => {
    expect(validateEvent({ name: "Party", budget: 0, guests: 10 })).toMatch(/budget/i);
  });
  it("rejects guests that are not whole numbers", () => {
    expect(validateEvent({ name: "Party", budget: 1000, guests: 2.5 })).toMatch(/guests/i);
  });
});

describe("validateReview", () => {
  const good = { catererId: 1, name: "Amina", comment: "Lovely food" };
  it("accepts a good review", () => {
    expect(validateReview(good)).toBe("");
  });
  it("needs a caterer", () => {
    expect(validateReview({ ...good, catererId: 0 })).toMatch(/caterer/i);
  });
  it("needs a name", () => {
    expect(validateReview({ ...good, name: "A" })).toMatch(/name/i);
  });
  it("needs a longer comment", () => {
    expect(validateReview({ ...good, comment: "ok" })).toMatch(/comment/i);
  });
});