# Gemini/Agent Instructions: German Lesson HTML Structure

Use this playbook to generate lesson pages in isolation (no repo assumptions). The only requirements are: Tailwind CDN plus two shared assets you host or place alongside your pages (`glossary.css`, `glossary.js`). Link them with a correct relative or absolute path.

## Learning objectives to serve
- Build reading comprehension (B1/B2) with sentence-level English support, gradually reducing reliance on translations.
- Expand vocabulary with word-by-word glosses plus a synced sidebar for quick lookup and spaced review.
- Strengthen grammar awareness (e.g., Präteritum, passive voice, relative clauses) via short cards/tables tied to the text.
- Improve pronunciation and prosody using optional TTS controls or audio snippets.
- Encourage active recall: design prompts/exercises (fill-in, reorder, cloze) that force production, not just recognition.
- Contextual fluency: ensure examples are authentic, varied (formal/informal), and show collocations and register.

## Required includes (head)
- Tailwind CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Inline sentence tooltip CSS (keep minimal block for `.sentence-translate` + `.translation`; use the snippet below).
- Shared glossary assets (no custom glossary JS inline):
  - `<link rel="stylesheet" href="PATH_TO/glossary.css">`
  - `<script src="PATH_TO/glossary.js" defer></script>`
- “PATH_TO” can be same-folder (`glossary.css`) or an `/assets/` folder—just keep it consistent; nothing else in the repo is required.

## Layout
- Body wrapper: `<main class="max-w-6xl mx-auto px-6 py-12">`
- Two-column grid: `<div class="lg:grid lg:grid-cols-[2.2fr_1fr] lg:gap-10">`
  - Left: article + grammar/vocab sections.
  - Right: glossary sidebar (see markup below).

## Glossary sidebar markup
```html
<aside class="glossary-sidebar bg-white shadow-xl rounded-2xl p-6 border border-slate-200 mt-10 lg:mt-0"
  id="glossary-sidebar">
  <p class="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">Word-by-word</p>
  <h3 class="text-xl font-bold text-slate-900 mb-4">Rechter Rand: Sofort-Glossar</h3>
  <p class="text-sm text-slate-600 mb-4">Fahre über markierte Wörter oder tippe sie an. Das passende Glossar rückt hier auf – ideal für schnelles Nachschlagen während des Lesens.</p>
  <div class="space-y-3" id="glossary-list" aria-live="polite"></div>
 </aside>
```
- Do NOT add your own glossary JS; the shared script auto-builds the list.
- Keep IDs `glossary-sidebar` and `glossary-list`.

## Annotating text
- Sentence translation: wrap each sentence
  ```html
  <span class="sentence-translate">
    ...German sentence...
    <span class="translation">English translation…</span>
  </span>
  ```
- Word-level glossing: wrap words/phrases
  ```html
  <span class="word-gloss" data-word="Wort" data-meaning="English meaning">Wort</span>
  ```
  - `data-word` optional if inner text is the word; `data-meaning` required.
  - Existing `.word-translate` with child `.translation` also works; the framework picks both up.

## Minimal head CSS to keep (example)
Only include the small block for `.sentence-translate` and `.translation` hover tooltips; no glossary styles or JS inline. Example:
```css
.sentence-translate { position: relative; cursor: help; border-bottom: 2px dotted #94a3b8; transition: background-color 0.2s ease-in-out; border-radius: 2px; }
.sentence-translate:hover { background-color: #e0f2fe; border-bottom-color: #0284c7; }
.translation { visibility: hidden; opacity: 0; width: 320px; background-color: #1e293b; color: #f8fafc; text-align: left; border-radius: 0.5rem; padding: 0.75rem; position: absolute; z-index: 50; bottom: 140%; left: 50%; transform: translateX(-50%); font-size: 0.875rem; line-height: 1.5; transition: opacity 0.2s ease-in-out, visibility 0.2s; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
.translation::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px; border-width: 6px; border-style: solid; border-color: #1e293b transparent transparent transparent; }
.sentence-translate:hover .translation { visibility: visible; opacity: 1; }
@media (max-width: 640px) { .translation { width: 250px; left: 0; transform: translateX(0); } .translation::after { left: 20px; } }
```

## Skeleton to follow
```html
<!DOCTYPE html>
<html lang="de">
<head>
  ...title, meta...
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- include the minimal sentence tooltip CSS block here -->
  <link rel="stylesheet" href="PATH_TO/glossary.css">
  <script src="PATH_TO/glossary.js" defer></script>
</head>
<body class="bg-slate-50 font-serif text-slate-800 antialiased leading-relaxed">
  <main class="max-w-6xl mx-auto px-6 py-12">
    <!-- header -->
    <div class="lg:grid lg:grid-cols-[2.2fr_1fr] lg:gap-10">
      <div class="space-y-12">
        <article class="bg-white shadow-xl rounded-2xl p-8 md:p-12 ring-1 ring-slate-900/5" id="reader">
          <h2 class="text-2xl font-bold text-slate-800 mb-6 font-sans border-l-4 border-blue-500 pl-4">Der Lesetext</h2>
          <div class="text-xl space-y-6 text-justify">
            <p>
              <span class="sentence-translate">
                <span class="word-gloss" data-meaning="princess">Fürstin</span> ...
                <span class="translation">Princess ...</span>
              </span>
            </p>
          </div>
        </article>
        <!-- grammar / vocab sections as needed -->
      </div>
      <!-- glossary sidebar -->
      <aside class="glossary-sidebar ...same as above..." id="glossary-sidebar">
        ... <div id="glossary-list"></div>
      </aside>
    </div>
    <!-- footer -->
  </main>
</body>
</html>
```

## Behavior expectations
- Hover/focus shows sentence translations (inline CSS).
- Hover/click/focus on words shows popups and syncs with sidebar; clicking sidebar scrolls to the word.
- No page jumps on hover; scrolling is only on click/focus.

Stick to these conventions to ensure every generated lesson works with the shared glossary framework.
