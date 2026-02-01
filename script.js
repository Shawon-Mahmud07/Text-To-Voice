/* =============================================================
   Global Variables and UI Element References
   ============================================================= */
const synth = window.speechSynthesis;
const textInput = document.getElementById("textInput");
const highlightOverlay = document.getElementById("highlightOverlay");
const langIndicator = document.getElementById("langIndicator");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const themeToggle = document.getElementById("themeToggle");

let voices = [];

/* =============================================================
   Language Detection Logic (Unicode based)
   ============================================================= */
function detectLanguage(text) {
  if (/[\u0980-\u09FF]/.test(text)) return { code: "bn", label: "Bengali" };
  if (/[\u0900-\u097F]/.test(text)) return { code: "hi", label: "Hindi" };
  return { code: "en", label: "English" };
}

/* =============================================================
   Asynchronous Voice Loading for Browser Compatibility
   ============================================================= */
function getVoicesPromise() {
  return new Promise((resolve) => {
    let v = synth.getVoices();
    if (v.length !== 0) {
      resolve(v);
    } else {
      // Wait for voices to be loaded by the browser
      synth.onvoiceschanged = () => {
        v = synth.getVoices();
        resolve(v);
      };
    }
  });
}

/* =============================================================
   Input Event: Syncs text with overlay and detects language
   ============================================================= */
textInput.addEventListener("input", () => {
  const text = textInput.value;
  highlightOverlay.innerText = text;
  const lang = detectLanguage(text);
  langIndicator.innerText = `Detected: ${lang.label}`;
});

/* =============================================================
   Core Speech Functionality with Word Highlighting
   ============================================================= */
async function speak() {
  // Prevent overlapping speech
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }

  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text!");
    return;
  }

  // Ensure voices are loaded before proceeding
  voices = await getVoicesPromise();
  const langInfo = detectLanguage(text);
  const utterThis = new SpeechSynthesisUtterance(text);

  // Improved filtering to find appropriate local voices (e.g., bn-BD or bn-IN)
  let selectedVoice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(langInfo.code),
  );

  if (selectedVoice) {
    utterThis.voice = selectedVoice;
    utterThis.lang = selectedVoice.lang;
  } else {
    // Fallback to regional codes if specific voice object is missing
    utterThis.lang =
      langInfo.code === "bn"
        ? "bn-IN"
        : langInfo.code === "hi"
          ? "hi-IN"
          : "en-US";
  }

  utterThis.rate = 1.0;
  utterThis.pitch = 1.0;

  // Visual Highlighting: Triggered on every word boundary
  utterThis.onboundary = (event) => {
    if (event.name === "word") {
      const start = event.charIndex;
      const end = start + event.charLength;
      const before = text.substring(0, start);
      const word = text.substring(start, end);
      const after = text.substring(end);
      highlightOverlay.innerHTML = `${before}<span class="word-highlight">${word}</span>${after}`;
    }
  };

  // UI State Management during speech
  utterThis.onstart = () => {
    speakBtn.disabled = true;
    stopBtn.disabled = false;
    speakBtn.querySelector("span").innerText = "Speaking...";
  };

  utterThis.onend = () => resetUI();
  utterThis.onerror = () => resetUI();

  synth.speak(utterThis);
}

/* =============================================================
   Reset UI to Default State
   ============================================================= */
function resetUI() {
  speakBtn.disabled = false;
  stopBtn.disabled = true;
  speakBtn.querySelector("span").innerText = "Speak";
  highlightOverlay.innerHTML = textInput.value;
}

/* =============================================================
   Event Listeners for Controls and Theme Toggle
   ============================================================= */
speakBtn.addEventListener("click", speak);

stopBtn.addEventListener("click", () => {
  synth.cancel();
  resetUI();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  synth.cancel();
  textInput.value = "";
  highlightOverlay.innerHTML = "";
  resetUI();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// Initializing voices on page load
getVoicesPromise().then((v) => {
  voices = v;
});
