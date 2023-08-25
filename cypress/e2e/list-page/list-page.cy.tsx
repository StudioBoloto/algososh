/// <reference types="cypress" />
export {};

describe('ListPage e2e testing', () => {
    it('should disable buttons when inputs are empty', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="button-add-head"]').should('be.disabled');
        cy.get('[data-testid="button-add-tail"]').should('be.disabled');
        cy.get('[data-testid="button-add-index"]').should('be.disabled');
        cy.get('[data-testid="button-delete-index"]').should('be.disabled');
        cy.get('[data-testid="button-delete-head"]').should('be.disabled');
        cy.get('[data-testid="button-delete-tail"]').should('be.disabled');

        cy.get('[data-testid="input"]').type('1');

        cy.get('[data-testid="button-add-head"]').should('not.be.disabled');
        cy.get('[data-testid="button-add-tail"]').should('not.be.disabled');
        cy.get('[data-testid="button-add-index"]').should('be.disabled');

        cy.get('[data-testid="button-add-head"]').click();
        cy.get('[data-testid="button-add-head"]').should('be.disabled');
        cy.get('[data-testid="button-add-tail"]').should('be.disabled');
        cy.get('[data-testid="button-add-index"]').should('be.disabled');
        cy.get('[data-testid="button-delete-index"]').should('be.disabled');
        cy.get('[data-testid="button-delete-head"]').should('not.be.disabled');
        cy.get('[data-testid="button-delete-tail"]').should('not.be.disabled');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="input-index"]').type('0');

        cy.get('[data-testid="button-add-head"]').should('not.be.disabled');
        cy.get('[data-testid="button-add-tail"]').should('not.be.disabled');
        cy.get('[data-testid="button-add-index"]').should('not.be.disabled');
        cy.get('[data-testid="button-add-index"]').click();
    });

    it('should render default list correctly', () => {
        cy.visit('http://localhost:3000/list');
        const inputValues: string[] = ['1', '2', '3', '4'];

        for (let i = 0; i < inputValues.length; ++i) {
            cy.get('[data-testid="input"]').type((i + 1).toString());
            cy.get('[data-testid="button-add-head"]').click();
        }

        cy.get('[class*=circle_content]').should('contain', 'head');
        cy.get('[class*=circle_content]').should('contain', 'tail');
    });

    it('should add to head correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-head"]').click();
        cy.get('[class*=circle_content]').should('contain', 'head');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');
    });

    it('should add to tail correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-tail"]').click();
        cy.get('[class*=circle_content]').should('contain', 'tail');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');
    });

    it('should add by index correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-head"]').click();

        cy.get('[data-testid="input"]').type('2');
        cy.get('[data-testid="input-index"]').type('0');
        cy.get('[data-testid="button-add-index"]').click();
        cy.get('[class*=circle_content]').should('contain', 'head');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);

        cy.get('[class*=circle_content]')
            .should('have.length', 5)
            .each((el, index) => {
                index === 2 && expect(el).contain('2');
                index === 3 && expect(el).contain('1');
            });
    });

    it('should delete from head correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-head"]').click();
        cy.get('[class*=circle_content]').should('contain', 'head');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');

        cy.get('[data-testid="button-delete-head"]').click();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class^="circle_circle"]').should('have.length', 2);

    });

    it('should delete from tail correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-tail"]').click();
        cy.get('[class*=circle_content]').should('contain', 'tail');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');

        cy.get('[data-testid="button-delete-tail"]').click();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class^="circle_circle"]').should('have.length', 2);

    });

    it('should delete by index correctly', () => {
        cy.visit('http://localhost:3000/list');

        cy.get('[data-testid="input"]').type('1');
        cy.get('[data-testid="button-add-head"]').click();

        cy.get('[data-testid="input"]').type('2');
        cy.get('[data-testid="input-index"]').type('0');
        cy.get('[data-testid="button-add-index"]').click();
        cy.get('[class*=circle_content]').should('contain', 'head');
        cy.get('[class*=circle_modified]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 3);
        cy.get('[class*=circle_default]').contains('1');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);

        cy.get('[class*=circle_content]')
            .should('have.length', 5)
            .each((el, index) => {
                index === 2 && expect(el).contain('2');
                index === 3 && expect(el).contain('1');
            });

        cy.get('[data-testid="input-index"]').type('0');
        cy.get('[data-testid="button-delete-index"]').click();

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.get('[class*=circle_content]').should('have.length', 4);
        cy.get('[class*=circle_default]').contains('1');
    });
});
