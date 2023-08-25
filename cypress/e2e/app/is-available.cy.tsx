/// <reference types="cypress" />
export {};

describe('App is available', () => {
    it('should load the app successfully', () => {
        cy.visit('http://localhost:3000');
    });
});
