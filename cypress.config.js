
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Puerto por defecto de Vite
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Opcional: desactiva la grabación de video para pruebas más rápidas
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implementar event listeners aquí si es necesario
    },
  },
})
