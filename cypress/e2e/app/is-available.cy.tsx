/// <reference types="cypress" />
import {baseUrl} from "../../../src/constants/selectors";

export {};

describe('App is available', () => {
    it('should load the app successfully', () => {
        cy.visit(baseUrl);
    });
});
