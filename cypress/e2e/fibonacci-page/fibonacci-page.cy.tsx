/// <reference types="cypress" />
export {};

describe('FibonacciPage e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('http://localhost:3000/fibonacci');

        cy.get('[data-testid="button"]').should('be.disabled');

        cy.get('[data-testid="input"]').type('1');

        cy.get('[data-testid="button"]').should('not.be.disabled');

    });

    it('Should generate numbers correctly and show animation', () => {
        const inputValue = 19;
        const outputValues: number[] = [1, 1, 2, 3, 5, 8,
            13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
            1597, 2584, 4181, 6765];


        cy.visit('http://localhost:3000/fibonacci');

        cy.get('[data-testid="input"]').type(inputValue.toString());

        cy.get('[data-testid="button"]').click();

        for (let i = 0; i < inputValue; ++i) {
            cy.get('[class^="circle_circle"]').as('circles');
            cy.get('@circles').each((circle) => {
                waitForStyleAndCheck(circle);
            });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);
        }

        function waitForStyleAndCheck(circle: JQuery) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal('4px solid rgb(0, 50, 255)');
            });
        }

        cy.get('[class^="circle_circle"]').each((circle, index) => {
            cy.wrap(circle).should('have.text', outputValues[index].toString());
        });

    });
});
