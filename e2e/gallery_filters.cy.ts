describe('Galería - filtros', () => {
  beforeEach(() => {
    // Si tu app hace fetch, ajusta la ruta y descomenta:
    // cy.intercept('GET', '/api/artworks', { fixture: 'artworks.json' }).as('getArts')

    cy.visit('/')
    // cy.wait('@getArts')
  })

  it('filtra por título', () => {
    cy.get('[data-cy="filter-title"]').type('mona')
    cy.get('[data-cy="card"]').should('have.length', 1)
    cy.get('[data-cy="card-title"]').first().should('contain', 'Mona Lisa')
  })

  it('filtra por artista', () => {
    cy.get('[data-cy="filter-artist"]').select('Pablo Picasso')
    cy.get('[data-cy="card-artist"]').each($p => {
      expect($p.text()).to.eq('Pablo Picasso')
    })
  })

  it('filtra por año', () => {
    cy.get('[data-cy="filter-year"]').clear().type('1937')
    cy.get('[data-cy="card-year"]').each($y => {
      expect($y.text()).to.eq('1937')
    })
  })
})
