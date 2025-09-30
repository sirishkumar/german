/* German Learning Project - Shared JavaScript */

// Namespace for German learning functionality
const GermanLearning = {
    // Configuration
    config: {
        tooltipDelay: 300,
        fadeInDuration: 200,
        keyboardNavigation: true,
        accessibilityMode: false
    },

    // Initialize the application
    init() {
        this.setupTooltips();
        this.setupKeyboardNavigation();
        this.setupFolderToggles();
        this.setupAccessibility();
        this.loadUserPreferences();
        console.log('German Learning app initialized');
    },

    // Tooltip functionality
    setupTooltips() {
        const tooltipElements = document.querySelectorAll('.tooltip, .word-translate');

        tooltipElements.forEach(element => {
            // Add ARIA attributes for accessibility
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-describedby', this.generateTooltipId(element));

            // Add keyboard support
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTooltip(element);
                }
            });

            // Add mouse support
            element.addEventListener('mouseenter', () => this.showTooltip(element));
            element.addEventListener('mouseleave', () => this.hideTooltip(element));

            // Add focus support
            element.addEventListener('focus', () => this.showTooltip(element));
            element.addEventListener('blur', () => this.hideTooltip(element));
        });
    },

    // Generate unique tooltip ID for accessibility
    generateTooltipId(element) {
        const text = element.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        return `tooltip-${text}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Show tooltip with animation
    showTooltip(element) {
        const tooltip = element.querySelector('.tooltiptext, .translation');
        if (tooltip) {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
            tooltip.classList.add('fade-in');

            // Announce to screen readers
            if (this.config.accessibilityMode) {
                this.announceToScreenReader(tooltip.textContent);
            }
        }
    },

    // Hide tooltip
    hideTooltip(element) {
        const tooltip = element.querySelector('.tooltiptext, .translation');
        if (tooltip) {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
            tooltip.classList.remove('fade-in');
        }
    },

    // Toggle tooltip for keyboard users
    toggleTooltip(element) {
        const tooltip = element.querySelector('.tooltiptext, .translation');
        if (tooltip) {
            const isVisible = tooltip.style.visibility === 'visible';
            if (isVisible) {
                this.hideTooltip(element);
            } else {
                this.showTooltip(element);
            }
        }
    },

    // Folder toggle functionality
    setupFolderToggles() {
        const folderToggles = document.querySelectorAll('.folder-toggle');

        folderToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                this.toggleFolder(toggle);
            });

            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
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
        const folderId = toggleButton.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        let content;

        if (folderId) {
            content = document.getElementById(folderId);
        } else {
            content = toggleButton.nextElementSibling;
        }

        if (content) {
            const icon = toggleButton.querySelector('.toggle-icon');
            const isHidden = content.style.display === 'none';

            if (isHidden) {
                content.style.display = 'block';
                content.classList.add('fade-in');
                if (icon) icon.textContent = '▼';
                toggleButton.setAttribute('aria-expanded', 'true');
            } else {
                content.style.display = 'none';
                content.classList.remove('fade-in');
                if (icon) icon.textContent = '▶';
                toggleButton.setAttribute('aria-expanded', 'false');
            }

            // Save folder state to localStorage
            this.saveFolderState(folderId || content.id, !isHidden);
        }
    },

    // Initialize folder states
    initializeFolders() {
        const folderContents = document.querySelectorAll('.folder-content');
        const folderToggles = document.querySelectorAll('.folder-toggle');

        folderContents.forEach((folder, index) => {
            const folderId = folder.id;
            const savedState = this.getFolderState(folderId);
            const toggle = folderToggles[index];
            const icon = toggle?.querySelector('.toggle-icon');

            if (savedState === null) {
                // Default: collapsed
                folder.style.display = 'none';
                if (icon) icon.textContent = '▶';
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            } else {
                folder.style.display = savedState ? 'block' : 'none';
                if (icon) icon.textContent = savedState ? '▼' : '▶';
                if (toggle) toggle.setAttribute('aria-expanded', savedState.toString());
            }
        });
    },

    // Save folder state to localStorage
    saveFolderState(folderId, isOpen) {
        if (!folderId) return;

        try {
            const folderStates = JSON.parse(localStorage.getItem('germanLearning_folderStates') || '{}');
            folderStates[folderId] = isOpen;
            localStorage.setItem('germanLearning_folderStates', JSON.stringify(folderStates));
        } catch (e) {
            console.warn('Could not save folder state:', e);
        }
    },

    // Get folder state from localStorage
    getFolderState(folderId) {
        if (!folderId) return null;

        try {
            const folderStates = JSON.parse(localStorage.getItem('germanLearning_folderStates') || '{}');
            return folderStates[folderId] || null;
        } catch (e) {
            console.warn('Could not load folder state:', e);
            return null;
        }
    },

    // Keyboard navigation setup
    setupKeyboardNavigation() {
        if (!this.config.keyboardNavigation) return;

        document.addEventListener('keydown', (e) => {
            // Escape key hides all tooltips
            if (e.key === 'Escape') {
                this.hideAllTooltips();
            }

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    },

    // Hide all visible tooltips
    hideAllTooltips() {
        const tooltipElements = document.querySelectorAll('.tooltip, .word-translate');
        tooltipElements.forEach(element => this.hideTooltip(element));
    },

    // Enhanced tab navigation
    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"]), .tooltip, .word-translate'
        );

        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);

        // Custom logic for better UX could be added here
        // For now, we let the browser handle default tab behavior
    },

    // Accessibility features
    setupAccessibility() {
        // Detect if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            this.config.fadeInDuration = 0;
            document.documentElement.style.setProperty('--transition', 'none');
        }

        // Detect screen reader usage
        this.detectScreenReader();

        // Add skip link functionality
        this.setupSkipLinks();
    },

    // Detect screen reader usage
    detectScreenReader() {
        // Simple detection method - can be enhanced
        const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                               window.navigator.userAgent.includes('JAWS') ||
                               window.speechSynthesis;

        if (hasScreenReader) {
            this.config.accessibilityMode = true;
            document.body.classList.add('screen-reader-active');
        }
    },

    // Setup skip links
    setupSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    },

    // Announce text to screen readers
    announceToScreenReader(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
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
            const prefs = JSON.parse(localStorage.getItem('germanLearning_preferences') || '{}');

            // Apply saved preferences
            if (prefs.darkMode !== undefined) {
                this.toggleDarkMode(prefs.darkMode);
            }

            if (prefs.fontSize !== undefined) {
                this.setFontSize(prefs.fontSize);
            }

        } catch (e) {
            console.warn('Could not load user preferences:', e);
        }
    },

    // Save user preferences
    saveUserPreferences(preferences) {
        try {
            const currentPrefs = JSON.parse(localStorage.getItem('germanLearning_preferences') || '{}');
            const updatedPrefs = { ...currentPrefs, ...preferences };
            localStorage.setItem('germanLearning_preferences', JSON.stringify(updatedPrefs));
        } catch (e) {
            console.warn('Could not save user preferences:', e);
        }
    },

    // Dark mode toggle
    toggleDarkMode(enable = null) {
        const isDarkMode = enable !== null ? enable : !document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        this.saveUserPreferences({ darkMode: isDarkMode });
        return isDarkMode;
    },

    // Font size adjustment
    setFontSize(size) {
        const validSizes = ['small', 'normal', 'large'];
        if (!validSizes.includes(size)) return;

        document.body.className = document.body.className.replace(/font-size-\w+/g, '');
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

    // Utility: Get text content without HTML
    getTextContent(element) {
        return element.textContent || element.innerText || '';
    },

    // Progressive enhancement check
    supportsLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GermanLearning.init());
} else {
    GermanLearning.init();
}

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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GermanLearning;
}

// Add to window for global access
window.GermanLearning = GermanLearning;
