// --- Language Switcher --- //
let currentLanguage = 'es'; // Keep track of the current language

const changeLanguage = async (language) => {
    const response = await fetch(`./src/locales/${language}.json`);
    const data = await response.json();
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (Array.isArray(data[key])) {
            element.innerHTML = data[key].map(item => `<p>${item}</p>`).join('');
        } else {
            element.innerHTML = data[key];
        }
    });
    // Update the button text
    const langButton = document.getElementById('lang-toggle');
    if (language === 'es') {
        langButton.textContent = 'EN';
    } else {
        langButton.textContent = 'ES';
    }
    currentLanguage = language;
};

const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
};

// Initial language load
changeLanguage('en');


// --- Firebase Clap Counter --- //

// **PASO IMPORTANTE**: Pega aquí el objeto de configuración de Firebase que copiaste.
const firebaseConfig = {
  // apiKey: "AIzaSy...",
  // authDomain: "resume-app-....firebaseapp.com",
  // ...
};

// Inicializa Firebase solo si la configuración no está vacía
if (firebaseConfig && firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const clapButton = document.getElementById('clap-button');
  const counterRef = db.collection('claps').doc('counter');

  // Carga el contador inicial y escucha cambios en tiempo real
  counterRef.onSnapshot((doc) => {
    if (doc.exists) {
      const count = doc.data().count;
      clapButton.innerHTML = `👏 ${count}`;
    } else {
      console.log("Counter document does not exist!");
    }
  });

  // Incrementa el contador cuando se hace clic
  clapButton.addEventListener('click', () => {
    // Usa la función de incremento transaccional de Firestore para evitar condiciones de carrera
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

} else {
  console.warn("Firebase config is missing. Clap counter will not work.");
  // Opcional: Ocultar el botón si Firebase no está configurado
  const clapButton = document.getElementById('clap-button');
  if(clapButton) {
    clapButton.style.display = 'none';
  }
}