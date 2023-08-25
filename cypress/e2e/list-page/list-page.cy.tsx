/// <reference types="cypress" />
import {SHORT_DELAY_IN_MS} from "../../../src/constants/delays";
import {
    buttonAddHeadSelector,
    buttonAddIndexSelector,
    buttonAddTailSelector,
    buttonDeleteHeadSelector,
    buttonDeleteIndexSelector,
    buttonDeleteTailSelector, circleCircleSelector,
    circleContentSelector,
    circleDefaultSelector, circleModifiedSelector,
    inputIndexSelector,
    inputSelector
} from "../../../src/constants/selectors";

export {};

describe('ListPage e2e testing', () => {
    it('should disable buttons when inputs are empty', () => {
        cy.visit('list');

        cy.get(buttonAddHeadSelector).should('be.disabled');
        cy.get(buttonAddTailSelector).should('be.disabled');
        cy.get(buttonAddIndexSelector).should('be.disabled');
        cy.get(buttonDeleteIndexSelector).should('be.disabled');
        cy.get(buttonDeleteHeadSelector).should('be.disabled');
        cy.get(buttonDeleteTailSelector).should('be.disabled');

        cy.get(inputSelector).type('1');

        cy.get(buttonAddHeadSelector).should('not.be.disabled');
        cy.get(buttonAddTailSelector).should('not.be.disabled');
        cy.get(buttonAddIndexSelector).should('be.disabled');

        cy.get(buttonAddHeadSelector).click();
        cy.get(buttonAddHeadSelector).should('be.disabled');
        cy.get(buttonAddTailSelector).should('be.disabled');
        cy.get(buttonAddIndexSelector).should('be.disabled');
        cy.get(buttonDeleteIndexSelector).should('be.disabled');
        cy.get(buttonDeleteHeadSelector).should('not.be.disabled');
        cy.get(buttonDeleteTailSelector).should('not.be.disabled');

        cy.get(inputSelector).type('1');
        cy.get(inputIndexSelector).type('0');

        cy.get(buttonAddHeadSelector).should('not.be.disabled');
        cy.get(buttonAddTailSelector).should('not.be.disabled');
        cy.get(buttonAddIndexSelector).should('not.be.disabled');
        cy.get(buttonAddIndexSelector).click();
    });

    it('should render default list correctly', () => {
        cy.visit('list');
        const inputValues: string[] = ['1', '2', '3', '4'];

        for (let i = 0; i < inputValues.length; ++i) {
            cy.get(inputSelector).type((i + 1).toString());
            cy.get(buttonAddHeadSelector).click();
        }

        cy.get(circleContentSelector).should('contain', 'head');
        cy.get(circleContentSelector).should('contain', 'tail');
    });

    it('should add to head correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddHeadSelector).click();
        cy.get(circleContentSelector).should('contain', 'head');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');
    });

    it('should add to tail correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddTailSelector).click();
        cy.get(circleContentSelector).should('contain', 'tail');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');
    });

    it('should add by index correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddHeadSelector).click();

        cy.get(inputSelector).type('2');
        cy.get(inputIndexSelector).type('0');
        cy.get(buttonAddIndexSelector).click();
        cy.get(circleContentSelector).should('contain', 'head');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(circleContentSelector)
            .should('have.length', 5)
            .each((el, index) => {
                index === 2 && expect(el).contain('2');
                index === 3 && expect(el).contain('1');
            });
    });

    it('should delete from head correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddHeadSelector).click();
        cy.get(circleContentSelector).should('contain', 'head');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');

        cy.get(buttonDeleteHeadSelector).click();

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleCircleSelector).should('have.length', 2);

    });

    it('should delete from tail correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddTailSelector).click();
        cy.get(circleContentSelector).should('contain', 'tail');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');

        cy.get(buttonDeleteTailSelector).click();

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleCircleSelector).should('have.length', 2);

    });

    it('should delete by index correctly', () => {
        cy.visit('list');

        cy.get(inputSelector).type('1');
        cy.get(buttonAddHeadSelector).click();

        cy.get(inputSelector).type('2');
        cy.get(inputIndexSelector).type('0');
        cy.get(buttonAddIndexSelector).click();
        cy.get(circleContentSelector).should('contain', 'head');
        cy.get(circleModifiedSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 3);
        cy.get(circleDefaultSelector).contains('1');

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(circleContentSelector)
            .should('have.length', 5)
            .each((el, index) => {
                index === 2 && expect(el).contain('2');
                index === 3 && expect(el).contain('1');
            });

        cy.get(inputIndexSelector).type('0');
        cy.get(buttonDeleteIndexSelector).click();


        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(circleContentSelector).should('have.length', 4);
        cy.get(circleDefaultSelector).contains('1');
    });
});
