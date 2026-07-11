(function () {
  window.initCharacterCounter = function () {
    const textarea = document.getElementById('char-input-text');
    const clearBtn = document.getElementById('char-clear-btn');

    if (!textarea || !clearBtn) return;

    // Listen to input events
    textarea.addEventListener('input', updateStats);

    // Listen to clear button click
    clearBtn.addEventListener('click', () => {
      textarea.value = '';
      updateStats();
      textarea.focus();
    });

    function updateStats() {
      const text = textarea.value;

      const charsWithSpaces = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      
      // Words: split by whitespace and filter out empty items
      const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
      const words = wordsArray.length;

      // Paragraphs: split by double/single newline and filter out empty items
      const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
      const paragraphs = paragraphsArray.length;

      // Reading time (average 200 words per minute)
      const readingTime = words === 0 ? 0 : Math.ceil(words / 200);

      // Speaking time (average 130 words per minute)
      const speakingTime = words === 0 ? 0 : Math.ceil(words / 130);

      // Update DOM elements
      document.getElementById('stat-chars-with-spaces').textContent = charsWithSpaces;
      document.getElementById('stat-chars-no-spaces').textContent = charsNoSpaces;
      document.getElementById('stat-words').textContent = words;
      document.getElementById('stat-paragraphs').textContent = paragraphs;
      document.getElementById('stat-reading-time').textContent = readingTime;
      document.getElementById('stat-speaking-time').textContent = speakingTime;
    }

    // Initial calculation run
    updateStats();
  };
})();
