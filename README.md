# Currículum Interactivo & Catálogo de Utilidades

> **Sitio web en vivo:** [https://frangomezfran.com.ar/](https://frangomezfran.com.ar/)

Este es un proyecto web personal que combina un **Currículum Vitae interactivo** con un **Catálogo de Utilidades Diarias** de alto rendimiento. Incluye funcionalidades avanzadas como internacionalización (i18n), contador de "me gusta" en tiempo real con Firebase, diseño responsive optimizado para dispositivos móviles y escritorio, y un temporizador interactivo con alarmas sonoras. El proyecto está completamente **contenerizado** con Docker para su despliegue continuo.

---

## 🛠️ Stack Técnico

- **Frontend**: HTML5 Semántico, CSS3 (compilado desde [Sass](https://sass-lang.com/)), JavaScript Modular (ES6+).
- **Librerías & Plugins**: [Flatpickr](https://flatpickr.js.org/) (datepickers en español/inglés), HTML5 Audio API.
- **Backend**: [Node.js](https://nodejs.org/) con [Express.js](https://expressjs.com/) para el servidor web de producción.
- **Base de Datos**: [Firebase Firestore](https://firebase.google.com/products/firestore) para el contador de "me gusta" en tiempo real.
- **Internacionalización (i18n)**: Sistema multilenguaje dinámico (Español / Inglés) mediante archivos JSON.
- **Contenerización**: [Docker](https://www.docker.com/) con scripts de despliegue local automatizados.
- **Estilos & UI**: Sistema de diseño moderno en Sass con temas oscuros, bordes neón/lima y soporte fluido de animaciones CSS Grid.

---

## 🧰 Catálogo de Utilidades Diarias (`/utils/`)

El sitio cuenta con una suite completa de utilidades prácticas accesibles en la ruta `/utils/`:

1. 📅 **Calculadora de Fechas**:
   - Cálculo exacto de días, semanas, meses y años entre dos fechas.
   - Suma y resta de períodos temporales.
   - Exclusión personalizada de días de la semana (ej. ignorar sábados y domingos).
2. ⏱️ **Calculadora de Horas**:
   - Suma y resta precisa de valores en formato Horas:Minutos:Segundos.
3. ⏳ **Temporizador**:
   - Conteo regresivo interactivo con barra de progreso visual.
   - Preajustes rápidos (1 min, 5 min, 10 min, 15 min, 25 min).
   - Alarma sonora en bucle (`alarm.mp3`) con desbloqueo de reproductor en dispositivos móviles (iOS/Android).
   - Actualización del título de la pestaña del navegador en tiempo real (ej. `01:29 Temporizador` / `⏰ ¡Finalizado!`).
4. 📝 **Contador de Caracteres**:
   - Métricas instantáneas de caracteres con/sin espacios, palabras y párrafos.
   - Estimación inteligente de tiempos de lectura y oratoria.
   - Grilla responsiva de 3 columnas adaptada a dispositivos móviles.
5. 🛠️ **JSON Formatter & JWT Codec**:
   - Herramientas de formateo y codificación/decodificación (en desarrollo).

---

## 📁 Estructura del Proyecto

```
.
├── Dockerfile              # Definición del contenedor Docker para producción
├── index.html              # Currículum Vitae principal
├── index.js                # Servidor backend con Express
├── package.json            # Dependencias y scripts de construcción
├── rerun_docker.bat        # Script de automatización para recompilar Docker en local
├── utils/                  # Catálogo de Utilidades Diarias (/utils/)
│   └── index.html          # Vista HTML principal del catálogo de utilidades
├── src/
│   ├── audio/
│   │   └── alarm.mp3       # Archivo de audio para el temporizador
│   ├── css/                # CSS compilado (no editar directamente)
│   ├── img/                # Favicones e imágenes de la aplicación
│   ├── js/
│   │   ├── main.js         # Lógica del CV (idiomas, contador de "me gusta")
│   │   ├── utils-main.js   # Orquestador del catálogo de utilidades (acordeones, eventos)
│   │   └── utils/          # Módulos de lógica para cada utilidad
│   │       ├── date-calculator.js
│   │       ├── hours-calculator.js
│   │       ├── minute-timer.js
│   │       └── character-counter.js
│   ├── locales/
│   │   ├── en.json         # Textos en Inglés (i18n)
│   │   └── es.json         # Textos en Español (i18n)
│   └── scss/
│       └── style.scss      # Archivo principal de estilos Sass
└── README.md
```

---

## 🚀 Instalación y Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/frangomezfran/resume.git
   cd resume
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   Este comando ejecuta en paralelo:
   - Servidor Express en `http://localhost:3000`.
   - Watcher de Sass (`npm run scss:watch`) que compila cambios en tiempo real.

4. **Despliegue rápido en Docker (Windows):**
   Ejecuta el script incluido para compilar la imagen y reiniciar el contenedor localmente:
   ```cmd
   rerun_docker.bat
   ```

---

## ⚙️ Deployment con Docker

Para construir y ejecutar la aplicación en cualquier servidor o contenedor:

1. **Construir la imagen de Docker:**
   ```bash
   docker build -t mi-resume-app .
   ```

2. **Ejecutar el contenedor:**
   ```bash
   docker run -p 3000:3000 -d mi-resume-app
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

---

## ✉️ Contacto

- **GitHub**: [@frangomezfran](https://github.com/frangomezfran)
- **LinkedIn**: [Franco Gomez](https://www.linkedin.com/in/frangomezfran/)
