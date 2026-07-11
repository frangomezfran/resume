(function () {
  let flatpickrMap = {};

  // Expose initializer globally
  window.initDateCalculator = function () {
    setupDatepickers();
    setupTabs();
    setupTodayButtons();
    setupConfigToggle();
    setupPillToggles();
    setupCalculations();
  };

  // Listen to language changes from utils-main.js
  window.onLanguageChange = function () {
    setupDatepickers();
    const durationCard = document.getElementById('duration-result-card');
    if (durationCard && durationCard.style.display !== 'none') {
      calculateDuration();
    }
    const addBox = document.getElementById('add-result-box');
    if (addBox && addBox.style.display !== 'none' && !addBox.classList.contains('error')) {
      calculateAddSubtract('add');
    }
    const subBox = document.getElementById('sub-result-box');
    if (subBox && subBox.style.display !== 'none' && !subBox.classList.contains('error')) {
      calculateAddSubtract('sub');
    }
  };

  // Flash validation warning on the input placeholder
  function flashInputError(inputId) {
    try {
      const originalInput = document.getElementById(inputId);
      if (!originalInput) return;

      const fpInstance = flatpickrMap[inputId];
      const visibleInput = fpInstance ? fpInstance.altInput : originalInput;
      if (!visibleInput) return;

      const isEs = window.currentLanguage === 'es';
      const msg = isEs ? 'Ingrese una fecha' : 'Enter a date';
      const originalPlaceholder = visibleInput.placeholder || '';

      visibleInput.classList.add('input-error');
      visibleInput.placeholder = msg;

      setTimeout(() => {
        visibleInput.classList.remove('input-error');
        visibleInput.placeholder = originalPlaceholder;
      }, 3000);
    } catch (err) {
      console.error("Error in flashInputError:", err);
    }
  }

  // Global reset function
  window.resetTab = function (type) {
    try {
      if (type === 'count') {
        if (flatpickrMap['count-start-date']) flatpickrMap['count-start-date'].clear();
        if (flatpickrMap['count-end-date']) flatpickrMap['count-end-date'].clear();
        document.querySelectorAll('.exclude-pill').forEach(pill => pill.classList.remove('active'));
        const card = document.getElementById('duration-result-card');
        if (card) card.style.display = 'none';
      } else {
        if (flatpickrMap[`${type}-start-date`]) flatpickrMap[`${type}-start-date`].clear();
        const y = document.getElementById(`${type}-years`);
        const m = document.getElementById(`${type}-months`);
        const w = document.getElementById(`${type}-weeks`);
        const d = document.getElementById(`${type}-days`);
        if (y) y.value = '';
        if (m) m.value = '';
        if (w) w.value = '';
        if (d) d.value = '';
        const box = document.getElementById(`${type}-result-box`);
        if (box) box.style.display = 'none';
      }
    } catch (err) {
      console.error("Error in resetTab:", err);
    }
  };

  function setupDatepickers() {
    try {
      Object.keys(flatpickrMap).forEach(key => {
        if (flatpickrMap[key]) {
          flatpickrMap[key].destroy();
        }
      });
      flatpickrMap = {};

      const currentLang = window.currentLanguage || 'es';
      const inputs = document.querySelectorAll('.datepicker-input');

      inputs.forEach(input => {
        const instance = flatpickr(input, {
          locale: currentLang === 'es' ? 'es' : 'default',
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: currentLang === 'es' ? 'd \\d\\e F \\d\\e Y' : 'F j, Y',
          allowInput: false,
          static: true // Forces layout relative inline to prevent scroll-to-right bugs!
        });
        flatpickrMap[input.id] = instance;
      });
    } catch (err) {
      console.error("Error in setupDatepickers:", err);
    }
  }

  function setupTabs() {
    try {
      const tabs = document.querySelectorAll('.calc-tabs .tab-btn');
      tabs.forEach(tab => {
        tab.replaceWith(tab.cloneNode(true));
      });

      const newTabs = document.querySelectorAll('.calc-tabs .tab-btn');
      newTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          
          newTabs.forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.date-calculator .tab-content').forEach(c => c.classList.remove('active'));
          
          tab.classList.add('active');
          const content = document.getElementById(`tab-${tabId}`);
          if (content) content.classList.add('active');

          // Reset the values of the tab that was clicked
          if (tabId === 'count-days') {
            resetTab('count');
          } else if (tabId === 'add-days') {
            resetTab('add');
          } else if (tabId === 'subtract-days') {
            resetTab('sub');
          }
        });
      });
    } catch (err) {
      console.error("Error in setupTabs:", err);
    }
  }

  function setupTodayButtons() {
    try {
      const todayBtns = document.querySelectorAll('.today-btn');
      todayBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
      });

      const newTodayBtns = document.querySelectorAll('.today-btn');
      newTodayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-target');
          if (flatpickrMap[targetId]) {
            flatpickrMap[targetId].setDate(new Date());
          }
        });
      });
    } catch (err) {
      console.error("Error in setupTodayButtons:", err);
    }
  }

  function setupConfigToggle() {
    try {
      const toggleBtn = document.getElementById('config-toggle-btn');
      if (!toggleBtn) return;

      toggleBtn.replaceWith(toggleBtn.cloneNode(true));
      const newToggleBtn = document.getElementById('config-toggle-btn');
      const panel = document.getElementById('config-options-panel');
      const icon = newToggleBtn.querySelector('.config-toggle-icon');

      newToggleBtn.addEventListener('click', () => {
        if (panel.classList.contains('open')) {
          panel.classList.remove('open');
          icon.textContent = '+';
        } else {
          panel.classList.add('open');
          icon.textContent = '−';
        }
      });
    } catch (err) {
      console.error("Error in setupConfigToggle:", err);
    }
  }

  function setupPillToggles() {
    try {
      const includeEndPill = document.getElementById('pill-include-end');
      if (includeEndPill) {
        includeEndPill.replaceWith(includeEndPill.cloneNode(true));
        const newPill = document.getElementById('pill-include-end');
        newPill.addEventListener('click', () => {
          newPill.classList.toggle('active');
        });
      }

      const excludePills = document.querySelectorAll('.exclude-pill');
      excludePills.forEach(pill => {
        pill.replaceWith(pill.cloneNode(true));
      });

      const newExcludePills = document.querySelectorAll('.exclude-pill');
      newExcludePills.forEach(pill => {
        pill.addEventListener('click', () => {
          pill.classList.toggle('active');
        });
      });
    } catch (err) {
      console.error("Error in setupPillToggles:", err);
    }
  }

  function setupCalculations() {
    try {
      const durationBtn = document.getElementById('calc-duration-btn');
      const addBtn = document.getElementById('calc-add-btn');
      const subBtn = document.getElementById('calc-sub-btn');

      const durationClearBtn = document.getElementById('clear-date-duration-btn');
      const addClearBtn = document.getElementById('clear-date-add-btn');
      const subClearBtn = document.getElementById('clear-date-sub-btn');

      if (durationBtn) {
        durationBtn.replaceWith(durationBtn.cloneNode(true));
        document.getElementById('calc-duration-btn').addEventListener('click', calculateDuration);
      }
      if (addBtn) {
        addBtn.replaceWith(addBtn.cloneNode(true));
        document.getElementById('calc-add-btn').addEventListener('click', () => calculateAddSubtract('add'));
      }
      if (subBtn) {
        subBtn.replaceWith(subBtn.cloneNode(true));
        document.getElementById('calc-sub-btn').addEventListener('click', () => calculateAddSubtract('sub'));
      }

      if (durationClearBtn) {
        durationClearBtn.replaceWith(durationClearBtn.cloneNode(true));
        document.getElementById('clear-date-duration-btn').addEventListener('click', () => window.resetTab('count'));
      }
      if (addClearBtn) {
        addClearBtn.replaceWith(addClearBtn.cloneNode(true));
        document.getElementById('clear-date-add-btn').addEventListener('click', () => window.resetTab('add'));
      }
      if (subClearBtn) {
        subClearBtn.replaceWith(subClearBtn.cloneNode(true));
        document.getElementById('clear-date-sub-btn').addEventListener('click', () => window.resetTab('sub'));
      }
    } catch (err) {
      console.error("Error in setupCalculations:", err);
    }
  }

  function calculateDuration() {
    try {
      const startVal = document.getElementById('count-start-date').value;
      const endVal = document.getElementById('count-end-date').value;
      const resultCard = document.getElementById('duration-result-card');

      if (!startVal) {
        flashInputError('count-start-date');
        return;
      }
      if (!endVal) {
        flashInputError('count-end-date');
        return;
      }

      const start = new Date(startVal + 'T00:00:00');
      const end = new Date(endVal + 'T00:00:00');
      
      const includeEndEl = document.getElementById('pill-include-end');
      const includeEnd = includeEndEl ? includeEndEl.classList.contains('active') : false;
      const excludedDays = Array.from(document.querySelectorAll('.exclude-pill.active')).map(el => parseInt(el.getAttribute('data-day'), 10));

      let current = new Date(start);
      let totalDays = 0;

      if (start <= end) {
        while (includeEnd ? current <= end : current < end) {
          const dayOfWeek = current.getDay();
          if (!excludedDays.includes(dayOfWeek)) {
            totalDays++;
          }
          current.setDate(current.getDate() + 1);
        }
      } else {
        while (includeEnd ? current >= end : current > end) {
          const dayOfWeek = current.getDay();
          if (!excludedDays.includes(dayOfWeek)) {
            totalDays--;
          }
          current.setDate(current.getDate() - 1);
        }
      }

      const absDays = Math.abs(totalDays);
      const weeks = absDays / 7;
      const months = absDays / 30.436; 
      const years = absDays / 365.242; 

      document.getElementById('res-days').textContent = totalDays;
      document.getElementById('res-weeks').textContent = formatDecimal(weeks, 2);
      document.getElementById('res-months').textContent = formatDecimal(months, 1);
      document.getElementById('res-years').textContent = formatDecimal(years, 2);

      if (resultCard) {
        resultCard.style.display = 'flex';
      }
    } catch (err) {
      console.error("Error in calculateDuration:", err);
    }
  }

  function calculateAddSubtract(prefix) {
    try {
      const startVal = document.getElementById(`${prefix}-start-date`).value;
      const resultBox = document.getElementById(`${prefix}-result-box`);

      if (!startVal) {
        flashInputError(`${prefix}-start-date`);
        return;
      }

      const start = new Date(startVal + 'T00:00:00');
      const years = parseInt(document.getElementById(`${prefix}-years`).value, 10) || 0;
      const months = parseInt(document.getElementById(`${prefix}-months`).value, 10) || 0;
      const weeks = parseInt(document.getElementById(`${prefix}-weeks`).value, 10) || 0;
      const days = parseInt(document.getElementById(`${prefix}-days`).value, 10) || 0;

      const target = new Date(start);
      const factor = prefix === 'sub' ? -1 : 1;

      target.setFullYear(target.getFullYear() + (years * factor));
      target.setMonth(target.getMonth() + (months * factor));
      target.setDate(target.getDate() + ((weeks * 7 + days) * factor));

      if (isNaN(target.getTime())) {
        const msg = window.currentLanguage === 'es' ? 'Fecha resultante inválida.' : 'Invalid resulting date.';
        resultBox.innerHTML = msg;
        resultBox.classList.add('error');
        resultBox.style.display = 'block';
        return;
      }

      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const locale = window.currentLanguage === 'es' ? 'es-ES' : 'en-US';
      const formattedDate = target.toLocaleDateString(locale, options);

      resultBox.innerHTML = formattedDate;
      resultBox.classList.remove('error');
      resultBox.style.display = 'block';
    } catch (err) {
      console.error("Error in calculateAddSubtract:", err);
    }
  }

  function formatDecimal(val, decimals) {
    const currentLang = window.currentLanguage || 'es';
    const formatted = val.toFixed(decimals);
    return currentLang === 'es' ? formatted.replace('.', ',') : formatted;
  }
})();
