/* Simple Text-to-Speech for German Learning */

class SimpleTTS {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.germanVoice = null;
        this.settings = {
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0,
            language: 'de-DE'
        };

        if (this.isSupported) {
            this.init();
        } else {
            console.warn('Text-to-Speech not supported in this browser');
        }
    }

    init() {
        this.loadVoices();
        this.createControls();
        this.setupEventListeners();

        // Load voices when they become available
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();

        // Find German voices
        const germanVoices = this.voices.filter(voice =>
            voice.lang.startsWith('de') ||
            voice.name.toLowerCase().includes('german') ||
            voice.name.toLowerCase().includes('deutsch')
        );

        this.germanVoice = germanVoices.length > 0 ? germanVoices[0] : this.voices[0];
        this.updateVoiceSelector();
    }

    createControls() {
        const controlsHTML = `
            <div id="simple-tts-controls" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                display: none;
                min-width: 280px;
                border: 1px solid #e2e8f0;
                font-family: system-ui, -apple-system, sans-serif;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #374151;">
                        🔊 Text-to-Speech
                    </h3>
                    <button id="tts-close" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #6b7280;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">✕</button>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; font-size: 12px; font-weight: 500; margin-bottom: 5px; color: #374151;">
                        Voice:
                    </label>
                    <select id="tts-voice-select" style="
                        width: 100%;
                        padding: 6px;
                        border: 1px solid #d1d5db;
                        border-radius: 4px;
                        font-size: 14px;
                        background: white;
                    "></select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 500; margin-bottom: 5px; color: #374151;">
                            Speed: <span id="rate-value">0.8</span>
                        </label>
                        <input type="range" id="tts-rate" min="0.3" max="2" step="0.1" value="0.8" style="width: 100%;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 500; margin-bottom: 5px; color: #374151;">
                            Pitch: <span id="pitch-value">1.0</span>
                        </label>
                        <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1.0" style="width: 100%;">
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <textarea id="tts-text-input" placeholder="Type German text here..." style="
                        width: 100%;
                        height: 60px;
                        padding: 8px;
                        border: 1px solid #d1d5db;
                        border-radius: 4px;
                        font-size: 14px;
                        resize: vertical;
                        font-family: inherit;
                    "></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <button id="tts-speak" style="
                        padding: 8px 12px;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                    ">▶ Speak</button>
                    <button id="tts-pause" style="
                        padding: 8px 12px;
                        background: #f59e0b;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                    ">⏸ Pause</button>
                    <button id="tts-stop" style="
                        padding: 8px 12px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                    ">⏹ Stop</button>
                </div>

                <div style="background: #f8fafc; padding: 10px; border-radius: 4px; font-size: 12px; color: #6b7280;">
                    <strong>Quick Tips:</strong><br>
                    • Double-click words to hear them<br>
                    • Press Escape to stop speech<br>
                    • Use Ctrl+Shift+S to toggle controls
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', controlsHTML);
    }

    updateVoiceSelector() {
        const select = document.getElementById('tts-voice-select');
        if (!select || this.voices.length === 0) return;

        select.innerHTML = '';

        // Add German voices first
        const germanVoices = this.voices.filter(voice =>
            voice.lang.startsWith('de') ||
            voice.name.toLowerCase().includes('german')
        );

        if (germanVoices.length > 0) {
            const germanGroup = document.createElement('optgroup');
            germanGroup.label = 'German Voices';
            germanVoices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = this.voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                if (voice === this.germanVoice) option.selected = true;
                germanGroup.appendChild(option);
            });
            select.appendChild(germanGroup);
        }

        // Add other voices
        const otherVoices = this.voices.filter(voice => !germanVoices.includes(voice));
        if (otherVoices.length > 0) {
            const otherGroup = document.createElement('optgroup');
            otherGroup.label = 'Other Voices';
            otherVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = this.voices.indexOf(voice);
                option.textContent = `${voice.name} (${voice.lang})`;
                otherGroup.appendChild(option);
            });
            select.appendChild(otherGroup);
        }
    }

    setupEventListeners() {
        // Voice selection
        const voiceSelect = document.getElementById('tts-voice-select');
        if (voiceSelect) {
            voiceSelect.addEventListener('change', (e) => {
                this.germanVoice = this.voices[e.target.value];
            });
        }

        // Rate control
        const rateSlider = document.getElementById('tts-rate');
        const rateValue = document.getElementById('rate-value');
        if (rateSlider && rateValue) {
            rateSlider.addEventListener('input', (e) => {
                this.settings.rate = parseFloat(e.target.value);
                rateValue.textContent = e.target.value;
            });
        }

        // Pitch control
        const pitchSlider = document.getElementById('tts-pitch');
        const pitchValue = document.getElementById('pitch-value');
        if (pitchSlider && pitchValue) {
            pitchSlider.addEventListener('input', (e) => {
                this.settings.pitch = parseFloat(e.target.value);
                pitchValue.textContent = e.target.value;
            });
        }

        // Control buttons
        const speakBtn = document.getElementById('tts-speak');
        const pauseBtn = document.getElementById('tts-pause');
        const stopBtn = document.getElementById('tts-stop');
        const closeBtn = document.getElementById('tts-close');
        const textInput = document.getElementById('tts-text-input');

        if (speakBtn) {
            speakBtn.addEventListener('click', () => {
                const text = textInput?.value || 'Hallo, das ist ein Test der deutschen Aussprache.';
                this.speak(text);
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (speechSynthesis.speaking) {
                    speechSynthesis.pause();
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                speechSynthesis.cancel();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        if (textInput) {
            textInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.speak(textInput.value);
                }
            });
        }

        // Setup word click handlers
        this.setupWordClickHandlers();

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        });
    }

    setupWordClickHandlers() {
        const tooltipElements = document.querySelectorAll('.tooltip, .word-translate');

        tooltipElements.forEach(element => {
            // Add visual indicator that element is speakable
            element.style.cursor = 'pointer';
            element.title = element.title || 'Double-click to hear pronunciation';

            // Double-click to speak
            element.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const text = element.textContent.trim();
                this.speak(text);

                // Visual feedback
                element.style.backgroundColor = '#bfdbfe';
                setTimeout(() => {
                    element.style.backgroundColor = '';
                }, 1000);
            });

            // Add TTS button to tooltips
            const tooltip = element.querySelector('.tooltiptext, .translation');
            if (tooltip && !tooltip.querySelector('.tts-mini-btn')) {
                const ttsBtn = document.createElement('button');
                ttsBtn.className = 'tts-mini-btn';
                ttsBtn.innerHTML = '🔊';
                ttsBtn.title = 'Speak this word';
                ttsBtn.style.cssText = `
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: rgba(59, 130, 246, 0.9);
                    border: none;
                    border-radius: 2px;
                    width: 16px;
                    height: 16px;
                    font-size: 8px;
                    cursor: pointer;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                ttsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.speak(element.textContent.trim());
                });

                tooltip.style.position = 'relative';
                tooltip.appendChild(ttsBtn);
            }
        });
    }

    speak(text) {
        if (!this.isSupported || !text.trim()) {
            console.warn('Cannot speak: TTS not supported or no text provided');
            return;
        }

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text.trim());

        // Apply settings
        utterance.voice = this.germanVoice;
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = this.settings.volume;
        utterance.lang = this.settings.language;

        // Event handlers
        utterance.onstart = () => {
            console.log('Speaking:', text);
        };

        utterance.onend = () => {
            console.log('Speech ended');
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
        };

        // Speak
        speechSynthesis.speak(utterance);
    }

    show() {
        const controls = document.getElementById('simple-tts-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hide() {
        const controls = document.getElementById('simple-tts-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    toggle() {
        const controls = document.getElementById('simple-tts-controls');
        if (controls) {
            if (controls.style.display === 'none') {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    stop() {
        speechSynthesis.cancel();
    }
}

// Initialize TTS when DOM is ready
let germanTTS = null;

function initTTS() {
    if (!germanTTS) {
        germanTTS = new SimpleTTS();

        // Add to global scope for easy access
        window.SimpleTTS = SimpleTTS;
        window.germanTTS = germanTTS;

        console.log('Simple TTS initialized');
    }
    return germanTTS;
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTTS);
} else {
    initTTS();
}

// Global helper functions
window.speakText = function(text) {
    if (germanTTS) {
        germanTTS.speak(text);
    }
};

window.toggleTTS = function() {
    if (germanTTS) {
        germanTTS.toggle();
    }
};

window.showTTS = function() {
    if (germanTTS) {
        germanTTS.show();
    }
};
