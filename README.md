# Currículum Interactivo

> **Sitio web en vivo:** [https://frangomezfran.com.ar/](https://frangomezfran.com.ar/)

Este es un proyecto de currículum web personal, construido con un enfoque en la interactividad y la personalización. Incluye características como un contador de "me gusta" en tiempo real y soporte para múltiples idiomas. El proyecto está completamente contenerizado con Docker para un despliegue sencillo.

## Stack Técnico

-   **Frontend**: HTML5, CSS3 (compilado desde [Sass](https://sass-lang.com/)), JavaScript (ES6+)
-   **Backend**: [Node.js](https://nodejs.org/) con [Express.js](https://expressjs.com/) para servir el contenido.
-   **Base de Datos**: [Firebase Firestore](https://firebase.google.com/products/firestore) para el contador de "me gusta" en tiempo real.
-   **Internacionalización (i18n)**: Soporte para Español e Inglés mediante archivos JSON.
-   **Contenerización**: [Docker](https://www.docker.com/).
-   **Build Tools**: `npm` para la gestión de scripts y dependencias.

## Estructura del Proyecto

```
.
├── Dockerfile              # Definición del contenedor para producción
├── index.html              # Estructura principal de la página
├── index.js                # Servidor backend con Express
├── package.json            # Dependencias y scripts del proyecto
├── src/
│   ├── css/                # CSS compilado (no editar directamente)
│   ├── js/
│   │   └── main.js         # Lógica de frontend (idiomas, contador de "me gusta")
│   ├── locales/
│   │   ├── en.json         # Textos en Inglés
│   │   └── es.json         # Textos en Español
│   └── scss/
│       └── style.scss      # Archivos de estilos Sass (editar aquí)
└── ...
```

## Instalación y Desarrollo

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/frangomezfran/resume.git
    cd resume
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el entorno de desarrollo:**
    ```bash
    npm run dev
    ```
    Este comando ejecuta dos procesos en paralelo:
    -   Inicia el servidor de Express (`npm:start`).
    -   Observa los cambios en los archivos `.scss` y los compila a CSS (`npm:scss:watch`).

    El sitio estará disponible en `http://localhost:3000`.

## Features Destacadas

-   **Contador de "Me Gusta"**: Utiliza Firebase Firestore para un contador de "me gusta" persistente y en tiempo real.
-   **Soporte Multilenguaje**: Cambia dinámicamente entre Español e Inglés sin recargar la página, cargando el contenido desde archivos `JSON`.
-   **Desplegable con Docker**: Incluye un `Dockerfile` listo para crear una imagen y desplegar la aplicación en cualquier entorno compatible.

## Configuración y Personalización

### Modificar Contenido del Currículum

Para cambiar la información (nombre, experiencia, habilidades), edita los archivos de idioma:
-   `src/locales/es.json` para la versión en español.
-   `src/locales/en.json` para la versión en inglés.

### Cambiar Estilos

Todos los estilos se gestionan con Sass. Para realizar cambios visuales:
1.  Modifica los archivos en `src/scss/`.
2.  El watcher (`npm run dev`) compilará automáticamente los cambios a `src/css/style.css`.

## Deployment con Docker

Puedes construir y ejecutar la aplicación fácilmente usando Docker:

1.  **Construir la imagen de Docker:**
    ```bash
    docker build -t mi-resume-app .
    ```

2.  **Ejecutar el contenedor:**
    ```bash
    docker run -p 3000:3000 -d mi-resume-app
    ```
    La aplicación estará corriendo en `http://localhost:3000`.

## Licencia

Este proyecto está bajo la licencia ISC.

## Contacto

-   **GitHub**: [@frangomezfran](https://github.com/frangomezfran)
-   **LinkedIn**: [Franco Gomez](https://www.linkedin.com/in/frangomezfran/)
