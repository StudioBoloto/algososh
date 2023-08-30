import {sortArray} from "./utils";
import {SortingTypes} from "./sorting-page";
import {Direction} from "../../types/direction";
import {ElementStates} from "../../types/element-states";

describe('sortArray', () => {
    test('Корректно сортирует пустой массив', () => {
        const sourceArray: number[] = [];
        const expectedOutputArrays: number[][] = [[]];
        const expectedAnimationStates: ElementStates[][] = [[]];

        const [animationStates, outputArrays] = sortArray(sourceArray, SortingTypes.bubbleSort, Direction.Descending);

        expect(outputArrays).toEqual(expectedOutputArrays);
        expect(animationStates).toEqual(expectedAnimationStates);
    });

    test('Корректно сортирует массив из одного элемента', () => {
        const sourceArray: number[] = [1];
        const expectedOutputArrays: number[][] = [[1]];
        const expectedAnimationStates: ElementStates[][] = [
            [ElementStates.Default,],
        ];

        const [animationStates, outputArrays] = sortArray(sourceArray, SortingTypes.selectionSort, Direction.Descending);

        expect(outputArrays).toEqual(expectedOutputArrays);
        expect(animationStates).toEqual(expectedAnimationStates);
    });

    test('Корректно сортирует массив из нескольких элементов', () => {
        const sourceArray: number[] = [3, 1, 2];
        const expectedOutputArrays: number[][] = [
            [1, 3, 2],
            [1, 2, 3],
            [1, 2, 3],
        ];
        const expectedAnimationStates: ElementStates[][] = [
            [ElementStates.Changing, ElementStates.Changing,],
            [ElementStates.Modified, ElementStates.Modified, ElementStates.Modified,],
            [ElementStates.Default, ElementStates.Default, ElementStates.Default,],
        ];

        const [animationStates, outputArrays] = sortArray(sourceArray, SortingTypes.bubbleSort, Direction.Ascending);

        expect(outputArrays).toEqual(expectedOutputArrays);
        expect(animationStates).toEqual(expectedAnimationStates);
    });
});
