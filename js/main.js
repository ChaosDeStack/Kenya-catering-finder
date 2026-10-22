import { getCaterers, getReviews } from "./api.js";
import { renderCaterers, showMessage } from "./ui.js";

async function init() {
  showMessage("status", "Loading caterers...", "loading");
  try {
    const [caterers, reviews] = await Promise.all([getCaterers(), getReviews()]);
    renderCaterers(caterers, reviews);
    showMessage("status", "");
  } catch (error) {
    showMessage("status", "Could not load caterers. Is the server running?", "error");
  }
}

init();