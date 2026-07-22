/**
 * Temporizador Module for Utils
 */
(function () {
  let timerInterval = null;
  let totalSeconds = 0;
  let remainingSeconds = 0;
  let isRunning = false;
  let isPaused = false;
  let isAlarmFinished = false;

  let alarmAudio = null;
  let originalDocumentTitle = document.title || 'Franco Gomez - Utils';

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }

  function updateDocumentTitle() {
    const isEs = (window.currentLanguage || 'es') === 'es';
    const timerTitleText = isEs ? 'Temporizador' : 'Timer';

    if (isAlarmFinished) {
      document.title = isEs ? '⏰ ¡Finalizado!' : "⏰ Time's up!";
    } else if (isRunning || isPaused) {
      document.title = `${formatTime(remainingSeconds)} ${timerTitleText}`;
    } else {
      document.title = originalDocumentTitle;
    }
  }

  function playAlarmSound() {
    try {
      if (!alarmAudio) {
        alarmAudio = new Audio('../src/audio/alarm.mp3');
        alarmAudio.loop = true;
      }
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(e => {
        console.warn('Playback error with ../src/audio/alarm.mp3, trying absolute path:', e);
        try {
          const fallback = new Audio('/src/audio/alarm.mp3');
          fallback.loop = true;
          fallback.play().catch(err => console.warn('Fallback play failed:', err));
          alarmAudio = fallback;
        } catch (err2) {}
      });
    } catch (err) {
      console.warn('Error playing audio file:', err);
    }
  }

  function stopAlarmSound() {
    if (alarmAudio) {
      try {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  function updateDisplay() {
    const displayEl = document.getElementById('timer-display');
    const progressBar = document.getElementById('timer-progress-fill');

    if (displayEl) {
      displayEl.textContent = formatTime(remainingSeconds);
    }

    if (progressBar) {
      if (totalSeconds > 0) {
        const percentage = Math.max(0, Math.min(100, (remainingSeconds / totalSeconds) * 100));
        progressBar.style.width = `${percentage}%`;
      } else {
        progressBar.style.width = '100%';
      }
    }

    updateDocumentTitle();
  }

  function startOrResumeTimer() {
    // Mobile Audio Unlock: prime audio element on user click to bypass iOS Safari autoplay policy
    if (alarmAudio) {
      alarmAudio.load();
      alarmAudio.play().then(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }).catch(() => {});
    }

    if (isAlarmFinished) {
      stopAlarmSound();
      isAlarmFinished = false;
      resetTimer();
      return;
    }

    if (isPaused) {
      // Resume paused timer
      isRunning = true;
      isPaused = false;
      toggleInputControls(true);
      updateButtonStates();
      updateDocumentTitle();

      timerInterval = setInterval(tick, 1000);
      return;
    }

    const minsInput = document.getElementById('timer-minutes-input');
    const secsInput = document.getElementById('timer-seconds-input');

    const mins = Math.max(0, parseInt(minsInput ? minsInput.value : 0, 10) || 0);
    const secs = Math.max(0, parseInt(secsInput ? secsInput.value : 0, 10) || 0);

    totalSeconds = (mins * 60) + secs;

    if (totalSeconds <= 0) {
      const timerCard = document.querySelector('.timer-display-box');
      if (timerCard) {
        timerCard.classList.add('shake-error');
        setTimeout(() => timerCard.classList.remove('shake-error'), 600);
      }
      return;
    }

    remainingSeconds = totalSeconds;
    isRunning = true;
    isPaused = false;
    isAlarmFinished = false;

    toggleInputControls(true);
    updateButtonStates();
    updateDisplay();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
  }

  function tick() {
    if (remainingSeconds <= 0) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      isRunning = false;
      isPaused = false;
      isAlarmFinished = true;
      remainingSeconds = 0;

      updateDisplay();
      toggleInputControls(false);
      updateButtonStates();
      playAlarmSound();
      return;
    }

    remainingSeconds--;
    updateDisplay();
  }

  function pauseTimer() {
    if (!isRunning) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    isRunning = false;
    isPaused = true;

    updateButtonStates();
    updateDocumentTitle();
  }

  function resetTimer() {
    stopAlarmSound();

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    isRunning = false;
    isPaused = false;
    isAlarmFinished = false;

    const minsInput = document.getElementById('timer-minutes-input');
    const secsInput = document.getElementById('timer-seconds-input');

    const mins = Math.max(0, parseInt(minsInput ? minsInput.value : 0, 10) || 0);
    const secs = Math.max(0, parseInt(secsInput ? secsInput.value : 0, 10) || 0);

    totalSeconds = (mins * 60) + secs;
    remainingSeconds = totalSeconds;

    toggleInputControls(false);
    updateButtonStates();
    updateDisplay();
  }

  function clearAllTimer() {
    stopAlarmSound();

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    isRunning = false;
    isPaused = false;
    isAlarmFinished = false;

    const minsInput = document.getElementById('timer-minutes-input');
    const secsInput = document.getElementById('timer-seconds-input');
    const presetBtns = document.querySelectorAll('.timer-preset-pill');

    if (minsInput) minsInput.value = '';
    if (secsInput) secsInput.value = '';
    presetBtns.forEach(btn => btn.classList.remove('active'));

    totalSeconds = 0;
    remainingSeconds = 0;

    toggleInputControls(false);
    updateButtonStates();
    updateDisplay();
  }

  // Global reset hook called on accordion collapse
  window.resetMinuteTimer = function () {
    clearAllTimer();
  };

  function toggleInputControls(disabled) {
    const minsInput = document.getElementById('timer-minutes-input');
    const secsInput = document.getElementById('timer-seconds-input');
    const presetBtns = document.querySelectorAll('.timer-preset-pill');

    if (minsInput) minsInput.disabled = disabled;
    if (secsInput) secsInput.disabled = disabled;
    presetBtns.forEach(btn => btn.disabled = disabled);
  }

  function updateButtonStates() {
    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');

    if (!startBtn || !pauseBtn) return;

    const isEs = (window.currentLanguage || 'es') === 'es';

    if (isAlarmFinished) {
      startBtn.style.display = 'inline-flex';
      startBtn.setAttribute('data-key', 'timer_btn_finish');
      startBtn.textContent = isEs ? 'Finalizar' : 'Finish';
      pauseBtn.style.display = 'none';
    } else if (isRunning) {
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-flex';
      pauseBtn.setAttribute('data-key', 'timer_btn_pause');
      pauseBtn.textContent = isEs ? 'Pausar' : 'Pause';
    } else if (isPaused) {
      startBtn.style.display = 'inline-flex';
      startBtn.setAttribute('data-key', 'timer_btn_resume');
      startBtn.textContent = isEs ? 'Continuar' : 'Continue';
      pauseBtn.style.display = 'none';
    } else {
      startBtn.style.display = 'inline-flex';
      startBtn.setAttribute('data-key', 'timer_btn_start');
      startBtn.textContent = isEs ? 'Iniciar' : 'Start';
      pauseBtn.style.display = 'none';
    }
  }

  window.onLanguageChangeMinuteTimer = function () {
    updateButtonStates();
    updateDocumentTitle();
  };

  const prevOnLangChange = window.onLanguageChange;
  window.onLanguageChange = function () {
    if (typeof prevOnLangChange === 'function') prevOnLangChange();
    if (typeof window.onLanguageChangeMinuteTimer === 'function') window.onLanguageChangeMinuteTimer();
  };

  window.initMinuteTimer = function () {
    if (document.title && !document.title.includes('Temporizador') && !document.title.includes('Timer')) {
      originalDocumentTitle = document.title;
    }

    const startBtn = document.getElementById('timer-start-btn');
    const pauseBtn = document.getElementById('timer-pause-btn');
    const clearInputsBtn = document.getElementById('clear-timer-btn');
    const minsInput = document.getElementById('timer-minutes-input');
    const secsInput = document.getElementById('timer-seconds-input');
    const presetBtns = document.querySelectorAll('.timer-preset-pill');

    if (startBtn && !startBtn.dataset.bound) {
      startBtn.dataset.bound = 'true';
      startBtn.addEventListener('click', startOrResumeTimer);
    }

    if (pauseBtn && !pauseBtn.dataset.bound) {
      pauseBtn.dataset.bound = 'true';
      pauseBtn.addEventListener('click', pauseTimer);
    }

    if (clearInputsBtn && !clearInputsBtn.dataset.bound) {
      clearInputsBtn.dataset.bound = 'true';
      clearInputsBtn.addEventListener('click', clearAllTimer);
    }

    presetBtns.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', function () {
          if (isRunning) return;
          presetBtns.forEach(p => p.classList.remove('active'));
          this.classList.add('active');
          const mins = this.getAttribute('data-minutes');
          if (minsInput) minsInput.value = mins;
          if (secsInput) secsInput.value = '0';
          resetTimer();
        });
      }
    });

    const onInputChange = () => {
      if (!isRunning && !isPaused && !isAlarmFinished) {
        const mins = Math.max(0, parseInt(minsInput ? minsInput.value : 0, 10) || 0);
        const secs = Math.max(0, parseInt(secsInput ? secsInput.value : 0, 10) || 0);
        totalSeconds = (mins * 60) + secs;
        remainingSeconds = totalSeconds;
        updateDisplay();
      }
    };

    if (minsInput && !minsInput.dataset.bound) {
      minsInput.dataset.bound = 'true';
      minsInput.addEventListener('input', onInputChange);
    }
    if (secsInput && !secsInput.dataset.bound) {
      secsInput.dataset.bound = 'true';
      secsInput.addEventListener('input', onInputChange);
    }

    onInputChange();
    updateDisplay();
    updateButtonStates();
  };
})();
