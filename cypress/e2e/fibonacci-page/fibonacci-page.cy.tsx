/// <reference types="cypress" />
import {DELAY_IN_MS} from "../../../src/constants/delays";
import {buttonSelector, circleCircleSelector, inputSelector} from "../../../src/constants/selectors";

export {};

describe('FibonacciPage e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('fibonacci');

        cy.get(buttonSelector).should('be.disabled');

        cy.get(inputSelector).type('1');

        cy.get(buttonSelector).should('not.be.disabled');

    });

    it('Should generate numbers correctly and show animation', () => {
        const inputValue = 19;
        const outputValues: number[] = [1, 1, 2, 3, 5, 8,
            13, 21, 34, 55, 89, 144, 233, 377, 610, 987,
            1597, 2584, 4181, 6765];


        cy.visit('fibonacci');

        cy.get(inputSelector).type(inputValue.toString());

        cy.get(buttonSelector).click();

        for (let i = 0; i < inputValue; ++i) {
            cy.get(circleCircleSelector).as('circles');
            cy.get('@circles').each((circle) => {
                waitForStyleAndCheck(circle);
            });
            cy.wait(DELAY_IN_MS);
        }

        function waitForStyleAndCheck(circle: JQuery) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal('4px solid rgb(0, 50, 255)');
            });
        }

        cy.get(circleCircleSelector).each((circle, index) => {
            cy.wrap(circle).should('have.text', outputValues[index].toString());
        });

    });
});
