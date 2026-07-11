(function () {
  let selectedOp = 'sum'; // 'sum' or 'sub'

  window.initHoursCalculator = function () {
    const sumPill = document.getElementById('hours-op-sum');
    const subPill = document.getElementById('hours-op-sub');
    const calcBtn = document.getElementById('calc-hours-btn');
    const clearBtn = document.getElementById('clear-hours-btn');

    if (!sumPill || !subPill || !calcBtn || !clearBtn) return;

    // Remove old listeners
    sumPill.replaceWith(sumPill.cloneNode(true));
    subPill.replaceWith(subPill.cloneNode(true));
    calcBtn.replaceWith(calcBtn.cloneNode(true));
    clearBtn.replaceWith(clearBtn.cloneNode(true));

    // Re-cache elements
    const newSumPill = document.getElementById('hours-op-sum');
    const newSubPill = document.getElementById('hours-op-sub');
    const newCalcBtn = document.getElementById('calc-hours-btn');
    const newClearBtn = document.getElementById('clear-hours-btn');

    // Operator selection pills listeners
    newSumPill.addEventListener('click', () => {
      selectedOp = 'sum';
      newSumPill.classList.add('active');
      newSubPill.classList.remove('active');
    });

    newSubPill.addEventListener('click', () => {
      selectedOp = 'sub';
      newSubPill.classList.add('active');
      newSumPill.classList.remove('active');
    });

    // Calculate & Clear listeners
    newCalcBtn.addEventListener('click', calculateHours);
    newClearBtn.addEventListener('click', resetHoursCalculator);
  };

  // Expose recalculate trigger for language switching
  window.onLanguageChangeHoursCalculator = function () {
    const resultCard = document.getElementById('hours-result-card');
    if (resultCard && resultCard.style.display !== 'none') {
      calculateHours();
    }
  };

  // Hook into global onLanguageChange event
  const prevOnLanguageChange = window.onLanguageChange;
  window.onLanguageChange = function () {
    if (typeof prevOnLanguageChange === 'function') {
      prevOnLanguageChange();
    }
    if (typeof window.onLanguageChangeHoursCalculator === 'function') {
      window.onLanguageChangeHoursCalculator();
    }
  };

  function resetHoursCalculator() {
    try {
      const h1 = document.getElementById('hours1');
      const m1 = document.getElementById('minutes1');
      const s1 = document.getElementById('seconds1');
      const h2 = document.getElementById('hours2');
      const m2 = document.getElementById('minutes2');
      const s2 = document.getElementById('seconds2');

      if (h1) h1.value = '';
      if (m1) m1.value = '';
      if (s1) s1.value = '';
      if (h2) h2.value = '';
      if (m2) m2.value = '';
      if (s2) s2.value = '';

      const card = document.getElementById('hours-result-card');
      if (card) card.style.display = 'none';
    } catch (err) {
      console.error("Error in resetHoursCalculator:", err);
    }
  }

  function calculateHours() {
    try {
      const h1 = parseInt(document.getElementById('hours1').value, 10) || 0;
      const m1 = parseInt(document.getElementById('minutes1').value, 10) || 0;
      const s1 = parseInt(document.getElementById('seconds1').value, 10) || 0;

      const h2 = parseInt(document.getElementById('hours2').value, 10) || 0;
      const m2 = parseInt(document.getElementById('minutes2').value, 10) || 0;
      const s2 = parseInt(document.getElementById('seconds2').value, 10) || 0;

      // Convert to total seconds
      const sec1 = (h1 * 3600) + (m1 * 60) + s1;
      const sec2 = (h2 * 3600) + (m2 * 60) + s2;

      let totalSec = 0;
      if (selectedOp === 'sum') {
        totalSec = sec1 + sec2;
      } else {
        totalSec = sec1 - sec2;
      }

      const isNegative = totalSec < 0;
      const absSec = Math.abs(totalSec);

      const resH = Math.floor(absSec / 3600);
      const resM = Math.floor((absSec % 3600) / 60);
      const resS = absSec % 60;

      // Format clock representation
      const formattedTime = `${isNegative ? '-' : ''}${resH}:${padZero(resM)}:${padZero(resS)}`;

      // Format description text
      const currentLang = window.currentLanguage || 'es';
      let desc = '';
      if (currentLang === 'es') {
        const textH = resH === 1 ? 'hora' : 'horas';
        const textM = resM === 1 ? 'minuto' : 'minutos';
        const textS = resS === 1 ? 'segundo' : 'segundos';
        desc = `${isNegative ? 'Menos ' : ''}${resH} ${textH}, ${resM} ${textM} y ${resS} ${textS}`;
      } else {
        const textH = resH === 1 ? 'hour' : 'hours';
        const textM = resM === 1 ? 'minute' : 'minutes';
        const textS = resS === 1 ? 'second' : 'seconds';
        desc = `${isNegative ? 'Minus ' : ''}${resH} ${textH}, ${resM} ${textM} and ${resS} ${textS}`;
      }

      const formattedResEl = document.getElementById('hours-formatted-res');
      const textResEl = document.getElementById('hours-text-res');
      const resultCard = document.getElementById('hours-result-card');

      if (formattedResEl && textResEl && resultCard) {
        formattedResEl.textContent = formattedTime;
        textResEl.textContent = desc;
        resultCard.style.display = 'flex';
      }
    } catch (err) {
      console.error("Error in calculateHours:", err);
    }
  }

  function padZero(num) {
    return num.toString().padStart(2, '0');
  }
})();
