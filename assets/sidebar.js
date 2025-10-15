// Sidebar component that can be loaded on any page
class SidebarManager {
  constructor() {
    // Calculate base path relative to current page
    this.basePath = this.getBasePath();

    this.sidebarHTML = `
            <aside class="sidebar w-80 p-6" id="app-sidebar">
                <div class="mb-6">
                    <a href="${this.basePath}index.html" class="block">
                        <h2 class="text-2xl font-bold text-indigo-600 mb-2">German Learning</h2>
                        <p class="text-sm text-gray-600">B1 Level Resources</p>
                    </a>
                </div>

                <nav class="space-y-3">
                    <!-- B1 Root Level -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="b1-root" aria-expanded="false" aria-controls="b1-root">
                            <span>📁 B1 Level (Main)</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="b1-root">
                            <a href="${this.basePath}b1/Bio-Lebensmittel.html" class="sidebar-link">
                                B1 Level: Lebensmittel (Food)
                            </a>
                            <a href="${this.basePath}b1/vorsätz-1.html" class="sidebar-link">
                                B1 Level: Vorsätz-1
                            </a>
                            <a href="${this.basePath}b1/7-2a.html" class="sidebar-link">
                                Wir Gehören Zussamen
                            </a>
                            <a href="${this.basePath}b1/6a-musik-und-emotionen.html" class="sidebar-link">
                                Musik und Emotionen
                            </a>
                            <a href="${this.basePath}b1/tts-demo.html" class="sidebar-link">
                                🔊 TTS Demo - Text-to-Speech
                            </a>
                        </div>
                    </div>

                    <!-- Wortschatz -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="wortschatz" aria-expanded="false" aria-controls="wortschatz">
                            <span>📁 Wortschatz</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="wortschatz">
                            <a href="${this.basePath}b1/Wortschatz/b1.2.html" class="sidebar-link">
                                Wortschatz
                            </a>
                            <a href="${this.basePath}b1/Wortschatz/kunst.html" class="sidebar-link">
                                Kunst
                            </a>
                            <a href="${this.basePath}b1/Wortschatz/3-gesellschaft.html" class="sidebar-link">
                                B1.2 - 124
                            </a>
                            <a href="${this.basePath}b1/Wortschatz/3-gesellschaft-2.html" class="sidebar-link">
                                B1.2 - 124 - Extended
                            </a>
                        </div>
                    </div>

                    <!-- Podcasts -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="podcasts" aria-expanded="false" aria-controls="podcasts">
                            <span>📁 Podcasts</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="podcasts">
                            <a href="${this.basePath}b1/podcasts/british-elections.html" class="sidebar-link">
                                UK Elections
                            </a>
                        </div>
                    </div>

                    <!-- News Articles -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="news-articles" aria-expanded="false" aria-controls="news-articles">
                            <span>📁 News Articles</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="news-articles">
                            <a href="${this.basePath}b1/news-articles/spiegel-1.html" class="sidebar-link">
                                Spiegel 1
                            </a>
                        </div>
                    </div>

                    <!-- Valerio -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="valerio" aria-expanded="false" aria-controls="valerio">
                            <span>📁 Valerio</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="valerio">
                            <a href="${this.basePath}b1/valerio/9_e2.html" class="sidebar-link">
                                Reif für den Wertstoffhoff
                            </a>
                            <a href="${this.basePath}b1/valerio/10.html" class="sidebar-link">
                                Die Frau in der Werbung
                            </a>
                            <a href="${this.basePath}b1/valerio/11_adolph_knigge.html" class="sidebar-link">
                                Adolph Knigge - Über den Umgang mit Menschen
                            </a>
                            <a href="${this.basePath}b1/valerio/11_andere_sitten.html" class="sidebar-link">
                                Andere Länder, andere Sitten
                            </a>
                            <a href="${this.basePath}b1/valerio/10_seite_36.html" class="sidebar-link">
                                Das Beste aus meinem Leben
                            </a>
                            <a href="${this.basePath}b1/valerio/12_moderne_rechsberatung.html" class="sidebar-link">
                                Moderne Rechtsberatung
                            </a>
                            <a href="${this.basePath}b1/valerio/12_zeigen_sie_auch_große.html" class="sidebar-link">
                                Zeigen Sie auch große
                            </a>
                            <a href="${this.basePath}b1/valerio/12_Gewissensfrage.html" class="sidebar-link">
                                Gewissensfrage
                            </a>
                        </div>
                    </div>

                    <!-- Rohan -->
                    <div class="folder-section">
                        <button
                            class="folder-toggle font-semibold py-2 px-4 rounded mb-2 transition duration-300 flex items-center justify-between"
                            data-target="rohan" aria-expanded="false" aria-controls="rohan">
                            <span>📁 Rohan</span>
                            <span class="toggle-icon">▶</span>
                        </button>
                        <div class="folder-content space-y-2 ml-4" id="rohan">
                            <a href="${this.basePath}b1/rohan/handys_in_der_schule.html" class="sidebar-link">
                                Handys in der Schule
                            </a>
                        </div>
                    </div>
                </nav>

                <!-- Settings Panel in Sidebar -->
                <div class="mt-8 pt-6 border-t border-gray-200">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Settings</h3>
                    <div class="space-y-2">
                        <button id="font-size-toggle"
                            class="w-full px-3 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-all font-medium text-left"
                            title="Adjust font size">
                            📝 Font Size
                        </button>
                        <button id="dark-mode-toggle"
                            class="w-full px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all font-medium text-left"
                            title="Toggle dark mode">
                            🌙 Dark Mode
                        </button>
                        <button id="expand-all"
                            class="w-full px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all font-medium text-left"
                            title="Expand all sections">
                            📂 Expand All
                        </button>
                        <button id="tts-toggle"
                            class="w-full px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-all font-medium text-left"
                            title="Toggle Text-to-Speech controls (Ctrl+Shift+S)">
                            🔊 TTS
                        </button>
                        <button id="tts-test"
                            class="w-full px-3 py-2 text-sm bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-all font-medium text-left"
                            title="Test TTS - Say Hello">
                            🎵 Test TTS
                        </button>
                    </div>
                </div>
            </aside>
        `;
  }

  init() {
    // Insert sidebar at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', this.sidebarHTML);

    // Add necessary classes to body and main content
    if (!document.body.classList.contains('has-sidebar')) {
      document.body.classList.add('has-sidebar');
    }

    // Initialize folder toggles
    this.initializeToggles();
    this.loadSavedStates();
    this.setupUtilityButtons();
    this.highlightCurrentPage();
  }

  getBasePath() {
    // Get the current page path
    let currentPath = window.location.pathname;

    // For file:// protocol, we need to handle the path differently
    if (window.location.protocol === 'file:') {
      // Find the 'german' folder in the path
      const germanIndex = currentPath.indexOf('/german/');
      if (germanIndex !== -1) {
        // Get path relative to 'german' folder
        currentPath = currentPath.substring(germanIndex + '/german/'.length);
      }
    }

    // Split path and filter out empty parts
    const pathParts = currentPath.split('/').filter(part => part);

    // Remove the filename from the path
    if (pathParts.length > 0 && pathParts[pathParts.length - 1].includes('.')) {
      pathParts.pop();
    }

    // Calculate how many levels deep we are from the root
    const depth = pathParts.length;

    // Create relative path back to root
    if (depth === 0) {
      return './';
    }

    return '../'.repeat(depth);
  }

  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('#app-sidebar .sidebar-link');
    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.style.background = 'var(--primary-color)';
        link.style.color = 'white';
        link.style.borderLeftColor = 'var(--secondary-color)';
      }
    });
  }

  initializeToggles() {
    const toggles = document.querySelectorAll(".folder-toggle");

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleFolder(toggle);
      });

      toggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleFolder(toggle);
        }
      });
    });
  }

  toggleFolder(toggle) {
    const targetId = toggle.getAttribute("data-target");
    const content = document.getElementById(targetId);
    const icon = toggle.querySelector(".toggle-icon");

    if (!content) return;

    const isHidden = !content.classList.contains("show");

    if (isHidden) {
      content.classList.add("show");
      content.style.display = "block";
      icon.textContent = "▼";
      toggle.setAttribute("aria-expanded", "true");

      content.style.opacity = "0";
      content.style.transform = "translateY(-10px)";

      requestAnimationFrame(() => {
        content.style.transition = "all 0.3s ease";
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
      });
    } else {
      content.classList.remove("show");
      content.style.transition = "all 0.3s ease";
      content.style.opacity = "0";
      content.style.transform = "translateY(-10px)";

      setTimeout(() => {
        content.style.display = "none";
        content.style.transition = "";
        content.style.opacity = "";
        content.style.transform = "";
      }, 300);

      icon.textContent = "▶";
      toggle.setAttribute("aria-expanded", "false");
    }

    this.saveState(targetId, isHidden);
  }

  expandAll() {
    const toggles = document.querySelectorAll(".folder-toggle");
    toggles.forEach((toggle) => {
      const targetId = toggle.getAttribute("data-target");
      const content = document.getElementById(targetId);

      if (content && !content.classList.contains("show")) {
        this.toggleFolder(toggle);
      }
    });
  }

  collapseAll() {
    const toggles = document.querySelectorAll(".folder-toggle");
    toggles.forEach((toggle) => {
      const targetId = toggle.getAttribute("data-target");
      const content = document.getElementById(targetId);

      if (content && content.classList.contains("show")) {
        this.toggleFolder(toggle);
      }
    });
  }

  saveState(folderId, isOpen) {
    try {
      const states = JSON.parse(localStorage.getItem("folderStates") || "{}");
      states[folderId] = isOpen;
      localStorage.setItem("folderStates", JSON.stringify(states));
    } catch (e) {
      console.warn("Could not save folder state:", e);
    }
  }

  loadSavedStates() {
    try {
      const states = JSON.parse(localStorage.getItem("folderStates") || "{}");
      Object.entries(states).forEach(([folderId, isOpen]) => {
        if (isOpen) {
          const toggle = document.querySelector(`[data-target="${folderId}"]`);
          if (toggle) {
            setTimeout(() => this.toggleFolder(toggle), 50);
          }
        }
      });
    } catch (e) {
      console.warn("Could not load folder states:", e);
    }
  }

  setupUtilityButtons() {
    // Font size toggle
    const fontToggle = document.getElementById("font-size-toggle");
    if (fontToggle) {
      let fontSize = "normal";
      fontToggle.addEventListener("click", () => {
        const sizes = ["small", "normal", "large"];
        const currentIndex = sizes.indexOf(fontSize);
        fontSize = sizes[(currentIndex + 1) % sizes.length];

        document.body.className = document.body.className.replace(/font-size-\w+/g, "");
        document.body.classList.add(`font-size-${fontSize}`);
      });
    }

    // Dark mode toggle
    const darkToggle = document.getElementById("dark-mode-toggle");
    if (darkToggle) {
      darkToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        darkToggle.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

        try {
          localStorage.setItem("darkMode", isDark);
        } catch (e) {
          console.warn("Could not save dark mode preference:", e);
        }
      });

      // Load dark mode preference
      try {
        const isDark = localStorage.getItem("darkMode") === "true";
        if (isDark) {
          document.body.classList.add("dark-mode");
          darkToggle.innerHTML = "☀️ Light Mode";
        }
      } catch (e) {
        console.warn("Could not load dark mode preference:", e);
      }
    }

    // Expand all toggle
    const expandToggle = document.getElementById("expand-all");
    if (expandToggle) {
      let allExpanded = false;
      expandToggle.addEventListener("click", () => {
        if (allExpanded) {
          this.collapseAll();
          expandToggle.innerHTML = "📂 Expand All";
          allExpanded = false;
        } else {
          this.expandAll();
          expandToggle.innerHTML = "📁 Collapse All";
          allExpanded = true;
        }
      });
    }

    // TTS toggle
    const ttsToggle = document.getElementById("tts-toggle");
    if (ttsToggle && typeof toggleTTS === 'function') {
      ttsToggle.addEventListener("click", () => {
        toggleTTS();
      });
    }

    // TTS test
    const ttsTest = document.getElementById("tts-test");
    if (ttsTest && typeof speakText === 'function') {
      ttsTest.addEventListener("click", () => {
        speakText('Hallo, das ist ein Test!');
      });
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = new SidebarManager();
    sidebar.init();
  });
} else {
  const sidebar = new SidebarManager();
  sidebar.init();
}
