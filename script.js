const synth = window.speechSynthesis;

const textInput = document.getElementById("textInput");
const highlightOverlay = document.getElementById("highlightOverlay");

const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");

const voiceSelect = document.getElementById("voiceSelect");
const genderSelect = document.getElementById("genderSelect");

const rateControl = document.getElementById("rateControl");
const pitchControl = document.getElementById("pitchControl");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");

const themeToggle = document.getElementById("themeToggle");

let voices = [];

/* -------------------------------
   LANGUAGE DETECT (Unicode)
-------------------------------- */
function detectLanguage(text) {
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  return "en";
}

/* -------------------------------
   BEST VOICE PICKER
-------------------------------- */
function isMale(voice) {
  return /male|man|masculine/i.test(voice.name);
}

function isFemale(voice) {
  return /female|woman|feminine/i.test(voice.name);
}

function getBestVoice(lang, gender) {
  let list = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));

  if (gender === "male") list = list.filter(isMale);
  if (gender === "female") list = list.filter(isFemale);

  // Bengali priority
  if (lang === "bn") {
    return (
      list.find((v) => v.lang === "bn-BD") ||
      list.find((v) => v.lang === "bn-IN") ||
      list[0]
    );
  }

  return list[0];
}

/* -------------------------------
   LOAD VOICES
-------------------------------- */
function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(opt);
  });
}

loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

/* -------------------------------
   UI EVENTS
-------------------------------- */
rateControl.addEventListener("input", () => {
  rateValue.innerText = rateControl.value;
});

pitchControl.addEventListener("input", () => {
  pitchValue.innerText = pitchControl.value;
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
});

/* -------------------------------
   SPEAK
-------------------------------- */
function speak() {
  if (synth.speaking) return;

  const text = textInput.value.trim();
  if (!text) return alert("Type something!");

  const lang = detectLanguage(text);
  const gender = genderSelect.value;

  const utter = new SpeechSynthesisUtterance(text);

  const manualVoice = voices[voiceSelect.value];
  const voice = manualVoice || getBestVoice(lang, gender);

  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }

  utter.rate = Number(rateControl.value);
  utter.pitch = Number(pitchControl.value);

  utter.onboundary = (e) => {
    if (e.name === "word") {
      const s = e.charIndex;
      const e2 = s + e.charLength;
      highlightOverlay.innerHTML =
        text.slice(0, s) +
        `<span class="word-highlight">${text.slice(s, e2)}</span>` +
        text.slice(e2);
    }
  };

  utter.onstart = () => {
    speakBtn.disabled = true;
    stopBtn.disabled = false;
  };

  utter.onend = resetUI;
  utter.onerror = resetUI;

  synth.speak(utter);
}

function resetUI() {
  speakBtn.disabled = false;
  stopBtn.disabled = true;
  highlightOverlay.innerHTML = "";
}

/* -------------------------------
   BUTTONS
-------------------------------- */
speakBtn.addEventListener("click", speak);

stopBtn.addEventListener("click", () => {
  synth.cancel();
  resetUI();
});

clearBtn.addEventListener("click", () => {
  synth.cancel();
  textInput.value = "";
  highlightOverlay.innerHTML = "";
  resetUI();
});
