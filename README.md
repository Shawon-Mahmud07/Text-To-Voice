# Text-to-Voice 🎙️

A modern, responsive **Text-to-Voice (TTV) web application** built with the **Web Speech API**. This tool converts written text into natural-sounding speech with real-time word highlighting and customizable voice settings.

---

## 🚀 Features

- 🔊 **Instant TTS**: Seamlessly convert text to speech using native browser engines.
- 🌐 **Smart Language Detection**: Automatically detects **English, Bengali, Hindi, Arabic, and Chinese** using Unicode range patterns.
- ✨ **Live Highlighting**: Visual word-by-word tracking as the text is being spoken.
- 🎛️ **Advanced Controls**:
    - **Voice Selection**: Choose from all available system voices.
    - **Gender Filtering**: Filter voices by Male or Female (browser-dependent).
    - **Speed & Pitch**: Fine-tune the audio output with real-time slider controls.
- 🌙 **Dual Themes**: Toggle between a sleek Dark Mode and a clean Light Mode.
- 📱 **Adaptive UI**: Fully responsive design optimized for both desktop and mobile devices.
- ⚡ **Privacy Focused**: Processes everything locally in the browser; no external API calls or data tracking.

---

## 🛠️ Built With

- **HTML5** – Semantic structure and layout.
- **CSS3 (Custom Properties)** – Modern theming, CSS Grid, and Flexbox.
- **Vanilla JavaScript** – Logic for speech synthesis and DOM manipulation.
- **Web Speech API** – Powering the core text-to-speech engine.
- **Font Awesome** – Interactive UI iconography.

---

## 📸 Preview

| Desktop View | Mobile View |
|-------------|-------------|
| ![Desktop Preview](./desktop.png) | ![Mobile Preview](./mobile.png) |

---

## 🧠 How It Works

1. **Input Analysis**: As you type or click 'Speak', the app runs a Regex check against Unicode blocks to identify the language.
2. **Voice Matching**: The `getBestVoice()` function attempts to find a voice that matches both the detected language and your selected gender preference.
3. **Synthesis**: The `SpeechSynthesisUtterance` interface handles the audio playback.
4. **Visual Sync**: The `onboundary` event captures the character index of spoken words, which is then mapped to the `highlightOverlay` to create the "karaoke" effect.

---

## 🌐 Live Demo
Experience the app here: [**Text-to-Voice**](https://text-2voice.netlify.app/) 🔗

## 📂 Project Structure

```plaintext
text-to-voice/
│
├── index.html      # Structure & UI Components
├── style.css       # Theming (Dark/Light) & Responsive Design
├── script.js       # Speech logic, Language detection & UI Events
└── README.md       # Project Documentation