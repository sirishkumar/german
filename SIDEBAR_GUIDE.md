# Sidebar Integration Guide

The sidebar is now available across all pages in the German Learning Resources site.

## How to Add Sidebar to Any Page

To add the persistent sidebar to any HTML page, follow these steps:

### 1. Add Required Files to `<head>`

```html
<head>
  <!-- ... other head content ... -->
  <link rel="stylesheet" href="../../assets/sidebar.css">
  <script src="../../assets/sidebar.js"></script>
  <script src="../../assets/tts-simple.js" defer></script>
</head>
```

**Note:** Adjust the path (`../../assets/`) based on your file's location:
- For files in `/b1/valerio/`: use `../../assets/`
- For files in `/b1/`: use `../assets/`
- For files in root: use `assets/`

### 2. Update Body Structure

Wrap your main content in a `<main>` tag:

```html
<body class="bg-gray-100 font-sans">
  <!-- Sidebar will be injected here automatically by sidebar.js -->
  <main class="p-4 sm:p-8">
    <!-- Your page content here -->
    <div class="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <!-- Content -->
    </div>
  </main>
</body>
```

### 3. That's It!

The sidebar will automatically:
- Load on page load
- Remember which folders were expanded (uses localStorage)
- Highlight the current page
- Provide navigation to all lessons
- Include settings controls (font size, dark mode, TTS, etc.)

## Features

- **Persistent Navigation**: The sidebar appears on all pages
- **State Management**: Folder states are saved in localStorage
- **Current Page Highlighting**: The active page is highlighted in the sidebar
- **Responsive**: On mobile devices, the sidebar stacks on top
- **Settings**: Font size, dark mode, expand/collapse all, TTS controls

## File Structure

```
/assets/
  ├── sidebar.js       # Main sidebar logic and HTML generation
  ├── sidebar.css      # Sidebar styling
  ├── styles.css       # General styles
  └── tts-simple.js    # Text-to-speech functionality
```

## Example Files

- `b1/valerio/12_moderne_rechsberatung.html` - Updated with sidebar
- `index.html` - Main page with sidebar

## Customization

To update the sidebar navigation (add/remove links), edit `assets/sidebar.js` and modify the `sidebarHTML` string in the `SidebarManager` constructor.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses ES6 features (classes, arrow functions, template literals)
- LocalStorage for state persistence
