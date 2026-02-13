const fs = require('fs');
const path = require('path');

// Carga las variables de entorno desde el archivo .env en la raíz del proyecto
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

console.log('Generating Firebase config...');

// Lee la plantilla
const templatePath = path.resolve(process.cwd(), 'src', 'js', 'firebaseConfig.js.template');
let templateContent;
try {
    templateContent = fs.readFileSync(templatePath, 'utf8');
} catch (error) {
    console.error(`Error: No se pudo leer el archivo de plantilla en ${templatePath}`);
    console.error('Asegúrate de que el archivo "src/js/firebaseConfig.js.template" existe.');
    process.exit(1);
}

// Objeto para mapear placeholders a variables de entorno
const replacements = {
    '__FIREBASE_API_KEY__': process.env.FIREBASE_API_KEY,
    '__FIREBASE_AUTH_DOMAIN__': process.env.FIREBASE_AUTH_DOMAIN,
    '__FIREBASE_PROJECT_ID__': process.env.FIREBASE_PROJECT_ID,
    '__FIREBASE_STORAGE_BUCKET__': process.env.FIREBASE_STORAGE_BUCKET,
    '__FIREBASE_MESSAGING_SENDER_ID__': process.env.FIREBASE_MESSAGING_SENDER_ID,
    '__FIREBASE_APP_ID__': process.env.FIREBASE_APP_ID
};

let configContent = templateContent;
let allKeysFound = true;

// Itera sobre el objeto de reemplazos
for (const placeholder in replacements) {
    const value = replacements[placeholder];
    if (!value) {
        console.error(`Error: La variable de entorno ${placeholder.replace(/__/g, '')} no está definida.`);
        allKeysFound = false;
    }
    // Reemplaza el placeholder (con comillas) por el valor (asegurándose de que tenga comillas)
    configContent = configContent.replace(`"${placeholder}"`, `"${value}"`);
}

if (!allKeysFound) {
    console.error('Asegúrate de que tu archivo .env o los secretos de GitHub contienen todas las claves necesarias.');
    process.exit(1);
}

// Escribe el archivo de configuración final
const outputPath = path.resolve(process.cwd(), 'src', 'js', 'firebaseConfig.js');
try {
    fs.writeFileSync(outputPath, configContent, 'utf8');
    console.log(`✅ Firebase config successfully generated at ${outputPath}`);
} catch (error) {
    console.error(`Error: No se pudo escribir el archivo de configuración en ${outputPath}`);
    process.exit(1);
}
