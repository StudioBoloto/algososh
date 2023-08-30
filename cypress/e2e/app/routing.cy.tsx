/// <reference types="cypress" />
export {};

describe('page routing Test', () => {
    const pages = ['recursion', 'fibonacci', 'sorting', 'stack', 'queue', 'list'];

    it('Should navigate to each visualization page', () => {
        cy.visit('');

        pages.forEach((page) => {
            cy.get(`[href="/${page}"]`).click();
            cy.url().should('include', page);
            cy.go('back');
        });
    });
});
