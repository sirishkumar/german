(function () {
  const SELECTORS = [".word-gloss", ".word-translate"];

  document.addEventListener("DOMContentLoaded", initGlossary);

  function initGlossary() {
    const wordNodes = collectWordNodes();
    if (!wordNodes.length) return;

    const { panel, listEl } = ensureSidebar();
    const glossaryMap = buildSidebarList(listEl, wordNodes);
    wireWordEvents(wordNodes, glossaryMap);
    wireSidebarEvents(glossaryMap);

    // Expose for debugging/extension
    window.GlossarySync = { wordNodes, panel, glossaryMap };
  }

  function collectWordNodes() {
    const nodes = Array.from(document.querySelectorAll(SELECTORS.join(",")));
    const filtered = [];

    nodes.forEach((node) => {
      const word = extractWord(node);
      const meaning = extractMeaning(node);
      if (!word || !meaning) return;

      const key = word.toLowerCase();
      node.dataset.glossaryWord = word;
      node.dataset.glossaryMeaning = meaning;
      node.dataset.glossaryKey = key;
      if (!node.hasAttribute("tabindex")) {
        node.setAttribute("tabindex", "0");
      }

      filtered.push(node);
    });

    return filtered;
  }

  function extractWord(node) {
    if (node.dataset.word) return node.dataset.word.trim();
    if (node.dataset.glossaryWord) return node.dataset.glossaryWord.trim();

    // Remove translation children to avoid concatenating meanings
    const clone = node.cloneNode(true);
    clone.querySelectorAll(".translation").forEach((el) => el.remove());
    return (clone.textContent || "").trim().replace(/\s+/g, " ");
  }

  function extractMeaning(node) {
    if (node.dataset.meaning) return node.dataset.meaning.trim();
    if (node.dataset.translation) return node.dataset.translation.trim();

    const translationEl = node.querySelector(".translation");
    if (translationEl && translationEl.textContent) {
      return translationEl.textContent.trim().replace(/\s+/g, " ");
    }

    if (node.title) return node.title.trim();
    return "";
  }

  function ensureSidebar() {
    const existingList = document.getElementById("glossary-list");
    if (existingList) {
      const panel =
        existingList.closest("#glossary-sidebar") ||
        existingList.closest(".glossary-panel") ||
        existingList.parentElement;
      return { panel, listEl: existingList };
    }

    const panel = document.createElement("aside");
    panel.id = "glossary-panel";
    panel.className = "glossary-panel";
    panel.innerHTML = `
      <div class="glossary-header">
        <div>
          <div class="glossary-caption">Word-by-word</div>
          <p class="glossary-title">Rechter Rand: Sofort-Glossar</p>
        </div>
        <button class="glossary-toggle" type="button" data-glossary-toggle aria-label="Toggle glossary">▼</button>
      </div>
      <div class="glossary-list" id="glossary-list" aria-live="polite"></div>
    `;

    document.body.appendChild(panel);

    const toggle = panel.querySelector("[data-glossary-toggle]");
    toggle.addEventListener("click", () => {
      panel.classList.toggle("collapsed");
    });

    return { panel, listEl: panel.querySelector("#glossary-list") };
  }

  function buildSidebarList(listEl, wordNodes) {
    const map = new Map();
    listEl.innerHTML = "";

    wordNodes.forEach((node) => {
      const word = node.dataset.glossaryWord;
      const meaning = node.dataset.glossaryMeaning;
      const key = node.dataset.glossaryKey;
      if (!word || !meaning || !key) return;

      if (!map.has(key)) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "glossary-item";
        item.dataset.glossaryKey = key;
        item.innerHTML = `
          <span class="glossary-term">${word}</span>
          <span class="glossary-meaning">${meaning}</span>
        `;
        listEl.appendChild(item);
        map.set(key, { item, nodes: [] });
      }

      map.get(key).nodes.push(node);
    });

    return map;
  }

  function wireWordEvents(wordNodes, map) {
    wordNodes.forEach((node) => {
      const key = node.dataset.glossaryKey;
      const entry = map.get(key);
      if (!entry) return;

      const activate = (shouldScroll = false) => {
        setActiveItem(map, key, shouldScroll);
        entry.nodes.forEach((n) => n.classList.add("glossary-word-active"));
      };

      const deactivate = () => {
        entry.item.classList.remove("active");
        entry.nodes.forEach((n) => n.classList.remove("glossary-word-active"));
      };

      node.addEventListener("mouseenter", () => activate(false));
      node.addEventListener("mouseleave", deactivate);
      node.addEventListener("focus", () => activate(true));
      node.addEventListener("blur", deactivate);
      node.addEventListener("click", () => activate(true));
      node.addEventListener("mouseup", () => activate(true));
      node.addEventListener(
        "touchend",
        () => activate(true),
        { passive: true },
      );
    });
  }

  function wireSidebarEvents(map) {
    map.forEach(({ item, nodes }, key) => {
      item.addEventListener("click", () => {
        setActiveItem(map, key, false);
        const target = nodes[0];
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.focus({ preventScroll: true });
          target.classList.add("glossary-word-active");
          setTimeout(
            () => target.classList.remove("glossary-word-active"),
            800,
          );
        }
      });

      item.addEventListener("mouseenter", () =>
        nodes.forEach((n) => n.classList.add("glossary-word-active")),
      );

      item.addEventListener("mouseleave", () =>
        nodes.forEach((n) => n.classList.remove("glossary-word-active")),
      );
    });
  }

  function setActiveItem(map, key, scrollSidebar = false) {
    map.forEach(({ item }) => item.classList.remove("active"));
    const entry = map.get(key);
    if (!entry) return;
    entry.item.classList.add("active");
    if (scrollSidebar) {
      entry.item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
})();
