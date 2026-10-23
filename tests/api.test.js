import { describe, it, expect, vi } from "vitest";
import {
  getCaterers, getReviews, getEvents,
  createEvent, updateEvent, patchEvent, deleteEvent, createReview,
} from "../js/api.js";

function mockFetch(ok, data = {}) {
  global.fetch = vi.fn().mockResolvedValue({ ok, json: async () => data });
}

describe("GET requests", () => {
  it("getCaterers returns the data", async () => {
    mockFetch(true, [{ id: 1 }]);
    expect(await getCaterers()).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/caterers");
  });
  it("getReviews and getEvents use their own addresses", async () => {
    mockFetch(true, []);
    await getReviews();
    await getEvents();
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/reviews");
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/events");
  });
});

describe("write requests", () => {
  it("createEvent sends a POST with the data", async () => {
    mockFetch(true, { id: 5 });
    const saved = await createEvent({ name: "Wedding" });
    expect(saved).toEqual({ id: 5 });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/events",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ name: "Wedding" }) })
    );
  });
  it("updateEvent sends a PUT to the event's address", async () => {
    mockFetch(true, { id: 5 });
    await updateEvent(5, { name: "New" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/events/5",
      expect.objectContaining({ method: "PUT" })
    );
  });
  it("patchEvent sends a PATCH", async () => {
    mockFetch(true, { id: 5 });
    await patchEvent(5, { status: "confirmed" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/events/5",
      expect.objectContaining({ method: "PATCH", body: JSON.stringify({ status: "confirmed" }) })
    );
  });
  it("deleteEvent sends a DELETE", async () => {
    mockFetch(true);
    await deleteEvent(5);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/events/5",
      expect.objectContaining({ method: "DELETE" })
    );
  });
  it("createReview sends a POST to reviews", async () => {
    mockFetch(true, { id: 9 });
    await createReview({ comment: "Great" });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/reviews",
      expect.objectContaining({ method: "POST" })
    );
  });
});

describe("errors", () => {
  const calls = [
    ["getCaterers", () => getCaterers()],
    ["getReviews", () => getReviews()],
    ["getEvents", () => getEvents()],
    ["createEvent", () => createEvent({})],
    ["updateEvent", () => updateEvent(1, {})],
    ["patchEvent", () => patchEvent(1, {})],
    ["deleteEvent", () => deleteEvent(1)],
    ["createReview", () => createReview({})],
  ];
  it.each(calls)("%s throws when the server says no", async (name, call) => {
    mockFetch(false);
    await expect(call()).rejects.toThrow();
  });
});