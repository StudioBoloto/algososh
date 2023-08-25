import {getReversingStringSteps} from "./utils";
import {ElementStates} from "../../types/element-states";

describe('getReversingStringSteps', () => {
    test('Корректно разворачивает строку с чётным количеством символов.', () => {
        const sourceString = 'abcdef';
        const [animationStates, outputArray] = getReversingStringSteps(sourceString);

        const expectedAnimationStates: ElementStates[][] = [
            [ElementStates.Changing, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Changing],
            [ElementStates.Modified, ElementStates.Changing, ElementStates.Default, ElementStates.Default, ElementStates.Changing, ElementStates.Modified],
            [ElementStates.Modified, ElementStates.Modified, ElementStates.Modified, ElementStates.Modified, ElementStates.Modified, ElementStates.Modified],
            [ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default]
        ];

        const expectedOutputArray: string[][] = [
            ['f', 'b', 'c', 'd', 'e', 'a'],
            ['f', 'e', 'c', 'd', 'b', 'a'],
            ['f', 'e', 'd', 'c', 'b', 'a'],
            ['f', 'e', 'd', 'c', 'b', 'a']
        ];

        expect(animationStates).toEqual(expectedAnimationStates);
        expect(outputArray).toEqual(expectedOutputArray);
        expect(outputArray[outputArray.length - 1].join('')).toBe('fedcba');

    });

    test('Корректно разворачивает строку с нечётным количеством символов.', () => {
        const sourceString = 'abcde';
        const [animationStates, outputArray] = getReversingStringSteps(sourceString);

        const expectedAnimationStates: ElementStates[][] = [
            [ElementStates.Changing, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Changing],
            [ElementStates.Modified, ElementStates.Changing, ElementStates.Default, ElementStates.Changing, ElementStates.Modified],
            [ElementStates.Modified, ElementStates.Modified, ElementStates.Modified, ElementStates.Modified, ElementStates.Modified],
            [ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default, ElementStates.Default]
        ];

        const expectedOutputArray: string[][] = [
            ['e', 'b', 'c', 'd', 'a'],
            ['e', 'd', 'c', 'b', 'a'],
            ['e', 'd', 'c', 'b', 'a'],
            ['e', 'd', 'c', 'b', 'a']
        ];

        expect(animationStates).toEqual(expectedAnimationStates);
        expect(outputArray).toEqual(expectedOutputArray);
        expect(outputArray[outputArray.length - 1].join('')).toBe('edcba');
    });

    test('Корректно разворачивает строку с одним символом.', () => {
        const sourceString = 'a';
        const [animationStates, outputArray] = getReversingStringSteps(sourceString);

        const expectedAnimationStates: ElementStates[][] = [
            [ElementStates.Modified],
            [ElementStates.Default]
        ];

        const expectedOutputArray: string[][] = [
            ['a'],
            ['a']
        ];

        expect(animationStates).toEqual(expectedAnimationStates);
        expect(outputArray).toEqual(expectedOutputArray);
        expect(outputArray[outputArray.length - 1].join('')).toBe('a');
    });

    test('Корректно разворачивает пустую строку', () => {
        const sourceString = '';
        const [animationStates, outputArray] = getReversingStringSteps(sourceString);

        const expectedAnimationStates: ElementStates[][] = [
            []
        ];

        const expectedOutputArray: string[][] = [
            []
        ];

        expect(animationStates).toEqual(expectedAnimationStates);
        expect(outputArray).toEqual(expectedOutputArray);
        expect(outputArray[outputArray.length - 1].join('')).toBe('');
    });
});
