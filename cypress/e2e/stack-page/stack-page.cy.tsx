/// <reference types="cypress" />
export {};

describe('StackPage e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('http://localhost:3000/stack');

        cy.get('[data-testid="button-add"]').should('be.disabled');

        cy.get('[data-testid="input"]').type('1');

        cy.get('[data-testid="button-add"]').should('not.be.disabled');
    });

    it('should add correctly', () => {
        cy.visit('http://localhost:3000/stack');

        const expectedStyles = [
            [{border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],
        ];

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get('[data-testid="input"]').type((i + 1).toString());
            cy.get('[data-testid="button-add"]').click();

            cy.get('[class^="circle_circle"]').each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
        }

        function waitForStyleAndCheck(circle: JQuery, i: number, index: number) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal(expectedStyles[i][index].border);
            });
        }

        cy.get('[class^="circle_circle"]').each((circle, index, list) => {
            expect(list).to.have.length(expectedStyles.length);
            cy.wrap(circle).should('have.text', index + 1);
        });

    });

    it('should remove correctly', () => {
        cy.visit('http://localhost:3000/stack');

        const expectedStyles = [
            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],

            [{border: '4px solid rgb(210, 82, 225)'},],
        ];

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get('[data-testid="input"]').type((i + 1).toString());
            cy.get('[data-testid="button-add"]').click();
        }

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get('[data-testid="button-delete"]').click();

            cy.get('[class^="circle_circle"]').each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
        }

        cy.get('[class^="circle_circle"]').should('have.length', 0);

        function waitForStyleAndCheck(circle: JQuery, i: number, index: number) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal(expectedStyles[i][index].border);
                cy.wrap(circle).should('have.text', index + 1);
            });
        }

        cy.get('[class^="circle_circle"]').should('have.length', 0);
    });

    it('should clear correctly', () => {
        cy.visit('http://localhost:3000/stack');

        cy.get('[data-testid="button-clear"]').should('be.disabled');

        for (let i = 1; i < 4; ++i) {
            cy.get('[data-testid="input"]').type(i.toString());
            cy.get('[data-testid="button-add"]').click();
            cy.get('[data-testid="button-clear"]').should('not.be.disabled');
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);
        }
        cy.get('[data-testid="button-clear"]').click();
        cy.get('[data-testid="button-clear"]').should('be.disabled');

        cy.get('[class^="circle_circle"]').should('have.length', 0);
    });
});
