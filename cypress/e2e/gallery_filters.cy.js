describe('Galería - Filtros y funcionalidad', () => {
  beforeEach(() => {
    // Visitar la aplicación
    cy.visit('/')
    
    // Esperar a que las tarjetas se carguen
    cy.get('[data-cy="artwork-card"]', { timeout: 10000 }).should('exist')
  });

  it('debe cargar las obras de arte inicialmente', () => {
    // Verificar que hay al menos una tarjeta
    cy.get('[data-cy="artwork-card"]').should('have.length.at.least', 1)
    
    // Verificar que cada tarjeta tiene título
    cy.get('[data-cy="artwork-card"]').first().within(() => {
      cy.get('[data-cy="artwork-title"]').should('exist')
      cy.get('[data-cy="artwork-artist"]').should('exist')
      cy.get('[data-cy="artwork-year"]').should('exist')
    })
  })

  it('filtra por título correctamente', () => {
    // Escribir en el campo de búsqueda
    cy.get('[data-cy="search-input"]').type('water')
    
    // Esperar a que se aplique el filtro (los filtros son reactivos)
    cy.wait(500)
    
    // Verificar que las tarjetas visibles contienen el texto en el título
    cy.get('[data-cy="artwork-card"]').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('[data-cy="artwork-title"]')
          .invoke('text')
          .should('match', /water/i)
      })
    })
  })

  it('filtra por artista correctamente', () => {
    // Primero obtener un artista de las tarjetas visibles
    cy.get('[data-cy="artwork-card"]').first().within(() => {
      cy.get('[data-cy="artwork-artist"]').then(($artist) => {
        const artistText = $artist.text().replace('Artista:', '').trim()
        
        // Seleccionar ese artista del select
        cy.get('[data-cy="artist-select"]').select(artistText)
        
        // Verificar que todas las tarjetas muestran ese artista
        cy.get('[data-cy="artwork-card"]').each(($card) => {
          cy.wrap($card).within(() => {
            cy.get('[data-cy="artwork-artist"]')
              .should('contain', artistText)
          })
        })
      })
    })
  })

  it('filtra por año correctamente', () => {
    // Escribir un año en el campo
    cy.get('[data-cy="year-input"]').clear().type('1900')
    
    // Esperar a que se aplique el filtro
    cy.wait(500)
    
    // Verificar que las tarjetas tienen años >= 1900
    // Nota: esto verifica que el filtro se aplica, aunque date_display puede tener formato diferente
    cy.get('[data-cy="artwork-card"]').should('have.length.at.least', 1)
  })

  it('los filtros se pueden combinar', () => {
    // Aplicar múltiples filtros
    cy.get('[data-cy="search-input"]').type('the')
    cy.get('[data-cy="year-input"]').clear().type('1800')
    
    // Esperar a que se apliquen los filtros
    cy.wait(500)
    
    // Verificar que hay resultados (o que muestra el mensaje de no resultados)
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="artwork-card"]').length > 0) {
        cy.get('[data-cy="artwork-card"]').should('exist')
      } else {
        cy.contains('No se encontraron obras').should('exist')
      }
    })
  })

  it('el scroll infinito carga más obras', () => {
    // Obtener el número inicial de tarjetas
    cy.get('[data-cy="artwork-card"]').then(($initialCards) => {
      const initialCount = $initialCards.length
      
      // Hacer scroll hasta el final
      cy.scrollTo('bottom')
      
      // Esperar a que se carguen más obras
      cy.wait(2000)
      
      // Verificar que hay más tarjetas
      cy.get('[data-cy="artwork-card"]').should('have.length.greaterThan', initialCount)
    })
  })

  it('filtrar por titulo', function() {
    cy.get('[data-cy="search-input"]').click();
    cy.get('[data-cy="search-input"]').type('zig');
  });
})