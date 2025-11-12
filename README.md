Guía express para correr el proyecto
1) ¿Tienes Node y npm?
node -v
npm -v


Si ves versiones (ej. v20.x / 10.x), sigue al paso 2.

Si no los tienes, instálalos:

Windows (elige 1)
# Opción A: winget (recomendada)
winget install OpenJS.NodeJS.LTS

# Opción B: chocolatey (si ya lo tienes)
choco install nodejs-lts -y

macOS (Homebrew)
brew install node

Ubuntu/Debian (NodeSource LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

2) ¿Tienes Git?
git --version


Si no lo tienes:

Windows:

winget install Git.Git


macOS:

brew install git


Ubuntu/Debian:

sudo apt-get update && sudo apt-get install -y git

3) Clonar el repositorio
git clone https://github.com/<TU_USUARIO>/<TU_REPO>.git
cd <TU_REPO>

4) Crear el archivo .env

El proyecto usa Vite; las variables deben empezar con VITE_.

Contenido que debe llevar:

VITE_API_BASE_URL="https://api.artic.edu/api/v1/artworks"

Forma rápida por sistema

Windows (PowerShell):

Set-Content -Path .env -Value 'VITE_API_BASE_URL="https://api.artic.edu/api/v1/artworks"'


macOS / Linux:

printf 'VITE_API_BASE_URL="https://api.artic.edu/api/v1/artworks"\n' > .env

5) Instalar dependencias
npm install

6) Ejecutar en modo desarrollo
npm run dev


Abre la URL que te muestre la terminal (normalmente http://localhost:5173).