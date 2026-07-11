// --- Language Switcher for Utils Page --- //
let currentLanguage = 'es'; // Keep track of the current language

const changeLanguage = async (language) => {
    try {
        const response = await fetch(`../src/locales/${language}.json`);
        const data = await response.json();
        window.currentLanguage = language;
        currentLanguage = language;

        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (data[key] !== undefined) {
                if (Array.isArray(data[key])) {
                    element.innerHTML = data[key].map(item => `<p>${item}</p>`).join('');
                } else {
                    element.innerHTML = data[key];
                }
            }
        });

        const placeholders = document.querySelectorAll('[data-key-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-key-placeholder');
            if (data[key] !== undefined) {
                element.placeholder = data[key];
            }
        });
        const langButton = document.getElementById('lang-toggle');
        if (langButton) {
            langButton.classList.toggle('en', language === 'en');
            langButton.classList.toggle('es', language === 'es');
        }

        // Notify modules that language has changed (e.g. Flatpickr update)
        if (typeof window.onLanguageChange === 'function') {
            window.onLanguageChange();
        }
    } catch (error) {
        console.error('Error changing language:', error);
    }
};

const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
};

// Initial language load
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('es');
    
    // --- Accordion Logic --- //
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', function () {
            const item = this.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            // Close all other accordion items
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-header').classList.remove('active');
                    otherItem.querySelector('.accordion-content').classList.remove('open');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                this.classList.remove('active');
                content.classList.remove('open');
            } else {
                item.classList.add('active');
                this.classList.add('active');
                content.classList.add('open');
                
                // Initialize specific tool if opened
                const toolId = item.getAttribute('data-tool');
                if (toolId === 'date-calculator' && typeof window.initDateCalculator === 'function') {
                    window.initDateCalculator();
                } else if (toolId === 'hours-calculator' && typeof window.initHoursCalculator === 'function') {
                    window.initHoursCalculator();
                } else if (toolId === 'character-counter' && typeof window.initCharacterCounter === 'function') {
                    window.initCharacterCounter();
                } else if (toolId === 'json-formatter' && typeof window.initJsonFormatter === 'function') {
                    window.initJsonFormatter();
                } else if (toolId === 'jwt-codec' && typeof window.initJwtCodec === 'function') {
                    window.initJwtCodec();
        }
      }
    });
  });
});

// --- Firebase Clap Counter for Utils Page --- //
if (typeof firebaseConfig !== 'undefined' && firebaseConfig && firebaseConfig.apiKey) {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();
  const likeButton = document.getElementById('like-button');
  const counterRef = db.collection('claps').doc('counter');

  if (likeButton) {
    // Carga el contador inicial y escucha cambios en tiempo real
    counterRef.onSnapshot((doc) => {
      if (doc.exists) {
        const count = doc.data().count;
        likeButton.innerHTML = `<span class="clap-heart">❤️</span><span class="clap-count">${count}</span>`;
      } else {
        console.log("Counter document does not exist!");
      }
    });

    // Incrementa el contador cuando se hace clic
    likeButton.addEventListener('click', () => {
      db.runTransaction((transaction) => {
        return transaction.get(counterRef).then((doc) => {
          if (!doc.exists) {
            throw "Document does not exist!";
          }
          const newCount = doc.data().count + 1;
          transaction.update(counterRef, { count: newCount });
        });
      }).catch((error) => {
        console.error("Error updating counter: ", error);
      });
    });
  }
} else {
  console.warn("Firebase config is missing. Clap counter will not work.");
  const likeButton = document.getElementById('like-button');
  if (likeButton) {
    likeButton.style.display = 'none';
  }
}
