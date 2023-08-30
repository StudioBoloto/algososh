/// <reference types="cypress" />
import {DELAY_IN_MS} from "../../../src/constants/delays";
import {buttonSelector, circleCircleSelector, inputSelector} from "../../../src/constants/selectors";

export {};

describe('StringComponent e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('recursion');

        cy.get(buttonSelector).should('be.disabled');

        cy.get(inputSelector).type('a');

        cy.get(buttonSelector).should('not.be.disabled');
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

        cy.visit('recursion');

        cy.get(inputSelector).type(inputValue);
        cy.get(buttonSelector).click();

        cy.get(circleCircleSelector).as('circles');

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get('@circles').each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            cy.wait(DELAY_IN_MS);
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
