/// <reference types="cypress" />
import {SHORT_DELAY_IN_MS} from "../../../src/constants/delays";
import {
    buttonAddSelector,
    buttonClearSelector, buttonDeleteSelector,
    circleCircleSelector,
    inputSelector
} from "../../../src/constants/selectors";

export {};

describe('StackPage e2e testing', () => {
    it('should disable button when input is empty', () => {
        cy.visit('stack');

        cy.get(buttonAddSelector).should('be.disabled');

        cy.get(inputSelector).type('1');

        cy.get(buttonAddSelector).should('not.be.disabled');
    });

    it('should add correctly', () => {
        cy.visit('stack');

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
            cy.get(inputSelector).type((i + 1).toString());
            cy.get(buttonAddSelector).click();

            cy.get(circleCircleSelector).each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            cy.wait(SHORT_DELAY_IN_MS);
        }

        function waitForStyleAndCheck(circle: JQuery, i: number, index: number) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal(expectedStyles[i][index].border);
            });
        }

        cy.get(circleCircleSelector).each((circle, index, list) => {
            expect(list).to.have.length(expectedStyles.length);
            cy.wrap(circle).should('have.text', index + 1);
        });

    });

    it('should remove correctly', () => {
        cy.visit('stack');

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
            cy.get(inputSelector).type((i + 1).toString());
            cy.get(buttonAddSelector).click();
        }

        for (let i = 0; i < expectedStyles.length; ++i) {
            cy.get(buttonDeleteSelector).click();

            cy.get(circleCircleSelector).each((circle, index) => {
                waitForStyleAndCheck(circle, i, index);
            });
            cy.wait(SHORT_DELAY_IN_MS);
        }

        cy.get(circleCircleSelector).should('have.length', 0);

        function waitForStyleAndCheck(circle: JQuery, i: number, index: number) {
            cy.wrap(circle).should('have.css', 'border').then((borderValue) => {
                expect(borderValue).to.equal(expectedStyles[i][index].border);
                cy.wrap(circle).should('have.text', index + 1);
            });
        }

        cy.get(circleCircleSelector).should('have.length', 0);
    });

    it('should clear correctly', () => {
        cy.visit('stack');

        cy.get(buttonClearSelector).should('be.disabled');

        for (let i = 1; i < 4; ++i) {
            cy.get(inputSelector).type(i.toString());
            cy.get(buttonAddSelector).click();
            cy.get(buttonClearSelector).should('not.be.disabled');

            cy.wait(SHORT_DELAY_IN_MS);
        }
        cy.get(buttonClearSelector).click();
        cy.get(buttonClearSelector).should('be.disabled');

        cy.get(circleCircleSelector).should('have.length', 0);
    });
});
