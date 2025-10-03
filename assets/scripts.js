/* German Learning Project - Shared JavaScript */

// Namespace for German learning functionality
const GermanLearning = {
  // Configuration
  config: {
    tooltipDelay: 300,
    fadeInDuration: 200,
    keyboardNavigation: true,
    accessibilityMode: false,
    tts: {
      enabled: true,
      language: "de-DE",
      rate: 0.8,
      pitch: 1.0,
      volume: 1.0,
      voice: null,
    },
  },

  // Initialize the application
  init() {
    this.setupTooltips();
    this.setupKeyboardNavigation();
    this.setupFolderToggles();
    this.setupAccessibility();
    this.setupTextToSpeech();
    this.loadUserPreferences();
    console.log("German Learning app initialized");
  },

  // Tooltip functionality
  setupTooltips() {
    const tooltipElements = document.querySelectorAll(
      ".tooltip, .word-translate",
    );

    tooltipElements.forEach((element) => {
      // Add ARIA attributes for accessibility
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute("aria-describedby", this.generateTooltipId(element));

      // Add TTS button to tooltip
      this.addTTSButton(element);

      // Add keyboard support
      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTooltip(element);
        } else if (e.key === "s" || e.key === "S") {
          e.preventDefault();
          this.speakText(this.getTextContent(element));
        }
      });

      // Add mouse support
      element.addEventListener("mouseenter", () => this.showTooltip(element));
      element.addEventListener("mouseleave", () => this.hideTooltip(element));

      // Add focus support
      element.addEventListener("focus", () => this.showTooltip(element));
      element.addEventListener("blur", () => this.hideTooltip(element));

      // Add double-click to speak
      element.addEventListener("dblclick", () => {
        this.speakText(this.getTextContent(element));
      });
    });
  },

  // Generate unique tooltip ID for accessibility
  generateTooltipId(element) {
    const text = element.textContent.trim().replace(/\s+/g, "-").toLowerCase();
    return `tooltip-${text}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Show tooltip with animation
  showTooltip(element) {
    const tooltip = element.querySelector(".tooltiptext, .translation");
    if (tooltip) {
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
      tooltip.classList.add("fade-in");

      // Announce to screen readers
      if (this.config.accessibilityMode) {
        this.announceToScreenReader(tooltip.textContent);
      }
    }
  },

  // Hide tooltip
  hideTooltip(element) {
    const tooltip = element.querySelector(".tooltiptext, .translation");
    if (tooltip) {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
      tooltip.classList.remove("fade-in");
    }
  },

  // Toggle tooltip for keyboard users
  toggleTooltip(element) {
    const tooltip = element.querySelector(".tooltiptext, .translation");
    if (tooltip) {
      const isVisible = tooltip.style.visibility === "visible";
      if (isVisible) {
        this.hideTooltip(element);
      } else {
        this.showTooltip(element);
      }
    }
  },

  // Folder toggle functionality
  setupFolderToggles() {
    const folderToggles = document.querySelectorAll(".folder-toggle");

    folderToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        this.toggleFolder(toggle);
      });

      toggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleFolder(toggle);
        }
      });
    });

    // Initialize folders as collapsed
    this.initializeFolders();
  },

  // Toggle folder visibility
  toggleFolder(toggleButton) {
    const folderId = toggleButton
      .getAttribute("onclick")
      ?.match(/'([^']+)'/)?.[1];
    let content;

    if (folderId) {
      content = document.getElementById(folderId);
    } else {
      content = toggleButton.nextElementSibling;
    }

    if (content) {
      const icon = toggleButton.querySelector(".toggle-icon");
      const isHidden = content.style.display === "none";

      if (isHidden) {
        content.style.display = "block";
        content.classList.add("fade-in");
        if (icon) icon.textContent = "▼";
        toggleButton.setAttribute("aria-expanded", "true");
      } else {
        content.style.display = "none";
        content.classList.remove("fade-in");
        if (icon) icon.textContent = "▶";
        toggleButton.setAttribute("aria-expanded", "false");
      }

      // Save folder state to localStorage
      this.saveFolderState(folderId || content.id, !isHidden);
    }
  },

  // Initialize folder states
  initializeFolders() {
    const folderContents = document.querySelectorAll(".folder-content");
    const folderToggles = document.querySelectorAll(".folder-toggle");

    folderContents.forEach((folder, index) => {
      const folderId = folder.id;
      const savedState = this.getFolderState(folderId);
      const toggle = folderToggles[index];
      const icon = toggle?.querySelector(".toggle-icon");

      if (savedState === null) {
        // Default: collapsed
        folder.style.display = "none";
        if (icon) icon.textContent = "▶";
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      } else {
        folder.style.display = savedState ? "block" : "none";
        if (icon) icon.textContent = savedState ? "▼" : "▶";
        if (toggle) toggle.setAttribute("aria-expanded", savedState.toString());
      }
    });
  },

  // Save folder state to localStorage
  saveFolderState(folderId, isOpen) {
    if (!folderId) return;

    try {
      const folderStates = JSON.parse(
        localStorage.getItem("germanLearning_folderStates") || "{}",
      );
      folderStates[folderId] = isOpen;
      localStorage.setItem(
        "germanLearning_folderStates",
        JSON.stringify(folderStates),
      );
    } catch (e) {
      console.warn("Could not save folder state:", e);
    }
  },

  // Get folder state from localStorage
  getFolderState(folderId) {
    if (!folderId) return null;

    try {
      const folderStates = JSON.parse(
        localStorage.getItem("germanLearning_folderStates") || "{}",
      );
      return folderStates[folderId] || null;
    } catch (e) {
      console.warn("Could not load folder state:", e);
      return null;
    }
  },

  // Keyboard navigation setup
  setupKeyboardNavigation() {
    if (!this.config.keyboardNavigation) return;

    document.addEventListener("keydown", (e) => {
      // Escape key hides all tooltips
      if (e.key === "Escape") {
        this.hideAllTooltips();
      }

      // Tab navigation enhancement
      if (e.key === "Tab") {
        this.handleTabNavigation(e);
      }
    });
  },

  // Hide all visible tooltips
  hideAllTooltips() {
    const tooltipElements = document.querySelectorAll(
      ".tooltip, .word-translate",
    );
    tooltipElements.forEach((element) => this.hideTooltip(element));
  },

  // Enhanced tab navigation
  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"]), .tooltip, .word-translate',
    );

    const currentIndex = Array.from(focusableElements).indexOf(
      document.activeElement,
    );

    // Custom logic for better UX could be added here
    // For now, we let the browser handle default tab behavior
  },

  // Accessibility features
  setupAccessibility() {
    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      this.config.fadeInDuration = 0;
      document.documentElement.style.setProperty("--transition", "none");
    }

    // Detect screen reader usage
    this.detectScreenReader();

    // Add skip link functionality
    this.setupSkipLinks();
  },

  // Detect screen reader usage
  detectScreenReader() {
    // Simple detection method - can be enhanced
    const hasScreenReader =
      window.navigator.userAgent.includes("NVDA") ||
      window.navigator.userAgent.includes("JAWS") ||
      window.speechSynthesis;

    if (hasScreenReader) {
      this.config.accessibilityMode = true;
      document.body.classList.add("screen-reader-active");
    }
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },

  // Announce text to screen readers
  announceToScreenReader(text) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = `Translation: ${text}`;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Load user preferences
  loadUserPreferences() {
    try {
      const prefs = JSON.parse(
        localStorage.getItem("germanLearning_preferences") || "{}",
      );

      // Apply saved preferences
      if (prefs.darkMode !== undefined) {
        this.toggleDarkMode(prefs.darkMode);
      }

      if (prefs.fontSize !== undefined) {
        this.setFontSize(prefs.fontSize);
      }
    } catch (e) {
      console.warn("Could not load user preferences:", e);
    }
  },

  // Save user preferences
  saveUserPreferences(preferences) {
    try {
      const currentPrefs = JSON.parse(
        localStorage.getItem("germanLearning_preferences") || "{}",
      );
      const updatedPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem(
        "germanLearning_preferences",
        JSON.stringify(updatedPrefs),
      );
    } catch (e) {
      console.warn("Could not save user preferences:", e);
    }
  },

  // Dark mode toggle
  toggleDarkMode(enable = null) {
    const isDarkMode =
      enable !== null ? enable : !document.body.classList.contains("dark-mode");

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    this.saveUserPreferences({ darkMode: isDarkMode });
    return isDarkMode;
  },

  // Font size adjustment
  setFontSize(size) {
    const validSizes = ["small", "normal", "large"];
    if (!validSizes.includes(size)) return;

    document.body.className = document.body.className.replace(
      /font-size-\w+/g,
      "",
    );
    document.body.classList.add(`font-size-${size}`);

    this.saveUserPreferences({ fontSize: size });
  },

  // Utility: Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Text-to-Speech functionality
  setupTextToSpeech() {
    if (!this.checkTTSSupport()) {
      console.warn("Text-to-Speech not supported in this browser");
      this.config.tts.enabled = false;
      return;
    }

    this.loadVoices();
    this.createTTSControls();

    // Listen for voices changed event (some browsers load voices asynchronously)
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  },

  checkTTSSupport() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  },

  loadVoices() {
    if (!this.config.tts.enabled) return;

    const voices = speechSynthesis.getVoices();
    const germanVoices = voices.filter(
      (voice) =>
        voice.lang.startsWith("de") ||
        voice.name.toLowerCase().includes("german") ||
        voice.name.toLowerCase().includes("deutsch"),
    );

    // Prefer German voices, fallback to first available voice
    this.config.tts.voice =
      germanVoices.length > 0 ? germanVoices[0] : voices[0];

    // Update voice selector if it exists
    this.updateVoiceSelector(voices, germanVoices);
  },

  createTTSControls() {
    // Create TTS control panel
    const controlsHtml = `
            <div id="tts-controls" class="tts-controls" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
                display: none;
                min-width: 250px;
                border: 1px solid #e2e8f0;
            ">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">🔊 Text-to-Speech</h4>

                <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 12px; margin-bottom: 5px;">Voice:</label>
                    <select id="tts-voice-select" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
                    </select>
                </div>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 12px; margin-bottom: 5px;">Speed:</label>
                        <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="0.8" style="width: 100%;">
                        <span style="font-size: 11px;" id="tts-rate-value">0.8x</span>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; font-size: 12px; margin-bottom: 5px;">Pitch:</label>
                        <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1" style="width: 100%;">
                        <span style="font-size: 11px;" id="tts-pitch-value">1.0</span>
                    </div>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                    <button id="tts-play" style="flex: 1; padding: 8px; border: none; background: #3b82f6; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">▶ Play</button>
                    <button id="tts-pause" style="flex: 1; padding: 8px; border: none; background: #f59e0b; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">⏸ Pause</button>
                    <button id="tts-stop" style="flex: 1; padding: 8px; border: none; background: #ef4444; color: white; border-radius: 4px; cursor: pointer; font-size: 12px;">⏹ Stop</button>
                </div>

                <div style="margin-bottom: 10px;">
                    <textarea id="tts-text-input" placeholder="Enter German text to practice..." style="width: 100%; height: 60px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; resize: vertical;"></textarea>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <small style="color: #666; font-size: 11px;">Double-click words to hear them</small>
                    <button id="tts-close" style="background: none; border: none; font-size: 16px; cursor: pointer;">✕</button>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", controlsHtml);
    this.setupTTSControlEvents();
  },

  setupTTSControlEvents() {
    const controls = document.getElementById("tts-controls");
    const voiceSelect = document.getElementById("tts-voice-select");
    const rateSlider = document.getElementById("tts-rate");
    const pitchSlider = document.getElementById("tts-pitch");
    const rateValue = document.getElementById("tts-rate-value");
    const pitchValue = document.getElementById("tts-pitch-value");
    const textInput = document.getElementById("tts-text-input");
    const playBtn = document.getElementById("tts-play");
    const pauseBtn = document.getElementById("tts-pause");
    const stopBtn = document.getElementById("tts-stop");
    const closeBtn = document.getElementById("tts-close");

    // Voice selection
    voiceSelect.addEventListener("change", (e) => {
      const voices = speechSynthesis.getVoices();
      this.config.tts.voice = voices[e.target.selectedIndex];
    });

    // Rate control
    rateSlider.addEventListener("input", (e) => {
      this.config.tts.rate = parseFloat(e.target.value);
      rateValue.textContent = e.target.value + "x";
    });

    // Pitch control
    pitchSlider.addEventListener("input", (e) => {
      this.config.tts.pitch = parseFloat(e.target.value);
      pitchValue.textContent = e.target.value;
    });

    // Control buttons
    playBtn.addEventListener("click", () => {
      const text =
        textInput.value.trim() ||
        "Hallo, das ist ein Test der deutschen Aussprache.";
      this.speakText(text);
    });

    pauseBtn.addEventListener("click", () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.pause();
      }
    });

    stopBtn.addEventListener("click", () => {
      speechSynthesis.cancel();
    });

    closeBtn.addEventListener("click", () => {
      controls.style.display = "none";
    });

    // Text input speak on Enter
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.speakText(textInput.value.trim());
      }
    });
  },

  updateVoiceSelector(allVoices, germanVoices) {
    const select = document.getElementById("tts-voice-select");
    if (!select) return;

    select.innerHTML = "";

    // Add German voices first
    if (germanVoices.length > 0) {
      const germanGroup = document.createElement("optgroup");
      germanGroup.label = "German Voices";
      germanVoices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        germanGroup.appendChild(option);
      });
      select.appendChild(germanGroup);
    }

    // Add other voices
    const otherVoices = allVoices.filter(
      (voice) => !germanVoices.includes(voice),
    );
    if (otherVoices.length > 0) {
      const otherGroup = document.createElement("optgroup");
      otherGroup.label = "Other Voices";
      otherVoices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = allVoices.indexOf(voice);
        option.textContent = `${voice.name} (${voice.lang})`;
        otherGroup.appendChild(option);
      });
      select.appendChild(otherGroup);
    }

    // Select the current voice
    if (this.config.tts.voice) {
      const voiceIndex = allVoices.indexOf(this.config.tts.voice);
      if (voiceIndex !== -1) {
        select.selectedIndex = voiceIndex;
      }
    }
  },

  addTTSButton(element) {
    if (!this.config.tts.enabled) return;

    const tooltip = element.querySelector(".tooltiptext, .translation");
    if (!tooltip) return;

    // Add TTS button to tooltip
    const ttsButton = document.createElement("button");
    ttsButton.className = "tts-button";
    ttsButton.innerHTML = "🔊";
    ttsButton.title = "Speak (S)";
    ttsButton.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            background: rgba(59, 130, 246, 0.8);
            border: none;
            border-radius: 3px;
            width: 20px;
            height: 20px;
            font-size: 10px;
            cursor: pointer;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

    ttsButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.speakText(this.getTextContent(element));
    });

    ttsButton.addEventListener("mouseenter", () => {
      ttsButton.style.opacity = "1";
    });

    ttsButton.addEventListener("mouseleave", () => {
      ttsButton.style.opacity = "0.7";
    });

    tooltip.style.position = "relative";
    tooltip.appendChild(ttsButton);
  },

  speakText(text, options = {}) {
    if (!this.config.tts.enabled || !text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configure utterance
    utterance.voice = options.voice || this.config.tts.voice;
    utterance.rate = options.rate || this.config.tts.rate;
    utterance.pitch = options.pitch || this.config.tts.pitch;
    utterance.volume = options.volume || this.config.tts.volume;
    utterance.lang = options.language || this.config.tts.language;

    // Add event listeners
    utterance.onstart = () => {
      console.log("TTS: Speaking started");
      this.highlightSpeakingElement(text);
    };

    utterance.onend = () => {
      console.log("TTS: Speaking ended");
      this.removeSpeakingHighlight();
    };

    utterance.onerror = (event) => {
      console.error("TTS Error:", event.error);
      this.removeSpeakingHighlight();
    };

    // Speak the text
    speechSynthesis.speak(utterance);
  },

  highlightSpeakingElement(text) {
    // Find elements containing the spoken text and highlight them
    const elements = document.querySelectorAll(".tooltip, .word-translate");
    elements.forEach((element) => {
      if (
        this.getTextContent(element).includes(text) ||
        text.includes(this.getTextContent(element))
      ) {
        element.classList.add("speaking");
        element.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
        element.style.transition = "background-color 0.3s ease";
      }
    });
  },

  removeSpeakingHighlight() {
    const speakingElements = document.querySelectorAll(".speaking");
    speakingElements.forEach((element) => {
      element.classList.remove("speaking");
      element.style.backgroundColor = "";
    });
  },

  // Toggle TTS controls visibility
  toggleTTSControls() {
    const controls = document.getElementById("tts-controls");
    if (controls) {
      controls.style.display =
        controls.style.display === "none" ? "block" : "none";
    }
  },

  // Utility: Get text content without HTML
  getTextContent(element) {
    return element.textContent || element.innerText || "";
  },

  // Progressive enhancement check
  supportsLocalStorage() {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  },

  // Public API methods for TTS
  speak: function (text, options) {
    return this.speakText(text, options);
  },

  stopSpeaking: function () {
    speechSynthesis.cancel();
  },

  pauseSpeaking: function () {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  },

  resumeSpeaking: function () {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  },

  showTTSControls: function () {
    const controls = document.getElementById("tts-controls");
    if (controls) {
      controls.style.display = "block";
    }
  },

  hideTTSControls: function () {
    const controls = document.getElementById("tts-controls");
    if (controls) {
      controls.style.display = "none";
    }
  },
};

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => GermanLearning.init());
} else {
  GermanLearning.init();
}

// Add global keyboard shortcuts for TTS
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Shift + S to toggle TTS controls
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
    e.preventDefault();
    GermanLearning.toggleTTSControls();
  }

  // Escape to stop speaking
  if (e.key === "Escape" && speechSynthesis.speaking) {
    GermanLearning.stopSpeaking();
  }
});

// Global function for backward compatibility with existing onclick handlers
function toggleFolder(folderId) {
  const content = document.getElementById(folderId);
  if (content) {
    const button = content.previousElementSibling;
    if (button) {
      GermanLearning.toggleFolder(button);
    }
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = GermanLearning;
}

// Add to window for global access
window.GermanLearning = GermanLearning;
