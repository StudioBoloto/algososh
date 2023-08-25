/// <reference types="cypress" />
export {};

describe('StringComponent e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('http://localhost:3000/recursion');

        cy.get('[data-testid="button"]').should('be.disabled');

        cy.get('[data-testid="input"]').type('a');

        cy.get('[data-testid="button"]').should('not.be.disabled');
    });

    it('Should reverse string correctly and show animation', () => {
        const inputValue = "abcde";
        const inputValueReverse = "edcba";

        const expectedStyles = [
            [{border: '4px solid rgb(210, 82, 225)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},],
            [{border: '4px solid rgb(127, 224, 81)'},
                {border: '4px solid rgb(210, 82, 225)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(210, 82, 225)'},
                {border: '4px solid rgb(127, 224, 81)'},],
            [{border: '4px solid rgb(127, 224, 81)'},
                {border: '4px solid rgb(127, 224, 81)'},
                {border: '4px solid rgb(127, 224, 81)'},
                {border: '4px solid rgb(127, 224, 81)'},
                {border: '4px solid rgb(127, 224, 81)'},],
            [{border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},
                {border: '4px solid rgb(0, 50, 255)'},]
        ];

        cy.visit('http://localhost:3000/recursion');

        cy.get('[data-testid="input"]').type(inputValue);
        cy.get('[data-testid="button"]').click();

        cy.get('[class^="circle_circle"]').as('circles');

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get('@circles').each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(1000);
        }

        function waitForStyleAndCheck(circle: JQuery, i: number, index: number) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal(expectedStyles[i][index].border);
            });
        }

        cy.get('@circles').each((circle, index, list) => {
            expect(list).to.have.length(inputValue.length);
            cy.wrap(circle).should('have.text', inputValueReverse[index]);
        });
    });
});
