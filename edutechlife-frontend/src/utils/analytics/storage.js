import { defaultMetrics, defaultABTests } from "./schema";

export function loadMetrics() {
  try {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading analytics:", e);
  }

  return JSON.parse(JSON.stringify(defaultMetrics));
}

export function saveMetrics() {
  try {
    this.metrics.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics));
  } catch (e) {
    console.error("Error saving analytics:", e);
  }
}

export function loadABTests() {
  try {
    const saved = localStorage.getItem(this.AB_TESTING_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading AB tests:", e);
  }

  return JSON.parse(JSON.stringify(defaultABTests));
}

export function saveABTests() {
  try {
    localStorage.setItem(this.AB_TESTING_KEY, JSON.stringify(this.abTests));
  } catch (e) {
    console.error("Error saving AB tests:", e);
  }
}

export function initialize() {
  if (this.initialized) return true;

  try {
    this.sessionStartTime = Date.now();
    this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.recordSessionStart();

    this.initialized = true;

    return true;
  } catch (error) {
    console.error("Error initializing analytics:", error);
    return false;
  }
}

export function clearData() {
  this.metrics = this.loadMetrics();
  this.abTests = this.loadABTests();
  this.saveMetrics();
  this.saveABTests();
}
