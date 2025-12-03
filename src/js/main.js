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
    const langButton = document.getElementById('lang-toggle');
    langButton.classList.toggle('en', language === 'en');
    langButton.classList.toggle('es', language === 'es');
    currentLanguage = language;
};

const toggleLanguage = () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    changeLanguage(newLang);
};

// Initial language load
changeLanguage('es');


// --- Firebase Clap Counter --- //

// **PASO IMPORTANTE**: Pega aquí el objeto de configuración de Firebase que copiaste.
const firebaseConfig = {
  apiKey: "AIzaSyASecjTZKHw6RzkJTMt5GQgGhXNigGe88c",
  authDomain: "resume-app-960e4.firebaseapp.com",
  projectId: "resume-app-960e4",
  storageBucket: "resume-app-960e4.firebasestorage.app",
  messagingSenderId: "566896126889",
  appId: "1:566896126889:web:38d049aeeff23e1871f2b8"
};

// Inicializa Firebase solo si la configuración no está vacía
if (firebaseConfig && firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const likeButton = document.getElementById('like-button');
  const counterRef = db.collection('claps').doc('counter');

  // Carga el contador inicial y escucha cambios en tiempo real
  counterRef.onSnapshot((doc) => {
    if (doc.exists) {
      const count = doc.data().count;
      likeButton.innerHTML = `❤️ ${count}`;    } else {
      console.log("Counter document does not exist!");
    }
  });

  // Incrementa el contador cuando se hace clic
  likeButton.addEventListener('click', () => {
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
  const likeButton = document.getElementById('like-button');
  if(likeButton) {
    likeButton.style.display = 'none';
  }
}