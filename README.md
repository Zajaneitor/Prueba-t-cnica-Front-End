# Galería de Arte – Art Institute of Chicago

Aplicación web en Vue 3 que consume la API del Art Institute of Chicago con filtros dinámicos, scroll infinito y pruebas E2E con Cypress.

## Instalación

## Es importante tener instalado Node para poder seguir con la instalación

1. **Instalar dependencias:**
   ```powershell
   npm install
   ```

2. **Crear archivo `.env`:**
   ```powershell
   Set-Content -Path .env -Value 'VITE_API_BASE_URL="https://api.artic.edu/api/v1/artworks"'
   ```

3. **Ejecutar el proyecto:**
   ```powershell
   npm run dev
   ```

   Abre la URL que muestra la terminal (normalmente `http://localhost:XXXX`).

## Ejecutar pruebas E2E

### Modo interactivo
```powershell
npm run test:cypress:open
```

### Modo headless
```powershell
npm run test:cypress
```

**Nota:** Asegúrate de que la aplicación esté corriendo (`npm run dev`) antes de ejecutar las pruebas.