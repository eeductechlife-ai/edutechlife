window.__voiceDebug = {
  lastVoice: null,
  lastProfile: null,
  lastPitch: null,
  path: null,
};

let userInteracted = false;
let pendingSpeakQueue = [];

function ensureUserInteraction() {
  if (userInteracted) return Promise.resolve();
  if (
    typeof navigator !== "undefined" &&
    !/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  ) {
    userInteracted = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    pendingSpeakQueue.push(resolve);
    if (pendingSpeakQueue.length === 1) {
      const handler = () => {
        userInteracted = true;
        const queue = pendingSpeakQueue.slice();
        pendingSpeakQueue.length = 0;
        queue.forEach((r) => r());
        document.removeEventListener("click", handler, true);
        document.removeEventListener("touchstart", handler, true);
        document.removeEventListener("keydown", handler, true);
      };
      document.addEventListener("click", handler, true);
      document.addEventListener("touchstart", handler, true);
      document.addEventListener("keydown", handler, true);
    }
  });
}

export { ensureUserInteraction };
