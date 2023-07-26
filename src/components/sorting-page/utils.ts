import {Direction} from "../../types/direction";
import {ElementStates} from "../../types/element-states";
import {SortingTypes} from "./sorting-page";

export const generateRandomArray = () => {
    const minLen = 3;
    const maxLen = 17;
    const arrLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

    const randomArray: number[] = [];
    for (let i = 0; i < arrLength; i++) {
        const randomNumber = Math.floor(Math.random() * 101);
        randomArray.push(randomNumber);
    }
    return randomArray;
};

export const sortArray = (inputArray: number[], sortingType: SortingTypes, direction: Direction) => {
    const ascending: boolean = direction === Direction.Ascending
    const defaultStep = Array(inputArray.length).fill(ElementStates.Default);
    const animationStates: ElementStates[][] = [];
    const outputArrays: number[][] = [];

    let stepStates: ElementStates[] = [];

    if (sortingType === SortingTypes.bubbleSort) {
        let swapped: boolean;
        do {
            swapped = false;
            for (let i = 0; i + 1 < inputArray.length; i++) {
                if ((ascending && inputArray[i] > inputArray[i + 1]) ||
                    (!ascending && inputArray[i] < inputArray[i + 1])) {

                    if (animationStates.length > 0) {
                        stepStates = [...animationStates[animationStates.length - 1]];
                        stepStates.forEach((state, index) => {
                            if (state === ElementStates.Changing) {
                                stepStates[index] = ElementStates.Modified;
                            }
                        });
                    }

                    stepStates[i] = ElementStates.Changing;
                    stepStates[i + 1] = ElementStates.Changing;

                    [inputArray[i], inputArray[i + 1]] = [inputArray[i + 1], inputArray[i]];
                    swapped = true;
                    outputArrays.push(inputArray.slice());
                    animationStates.push(stepStates);
                }
            }
        } while (swapped);

    } else if (sortingType === SortingTypes.selectionSort) {
        for (let i = 0; i + 1 < inputArray.length; i++) {
            let minIndex = i;
            for (let j = i + 1; j < inputArray.length; j++) {
                if ((ascending && inputArray[j] < inputArray[minIndex]) ||
                    (!ascending && inputArray[j] > inputArray[minIndex])) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                if (animationStates.length > 0) {
                    stepStates = [...animationStates[animationStates.length - 1]];
                    stepStates.forEach((state, index) => {
                        if (state === ElementStates.Changing) {
                            stepStates[index] = ElementStates.Modified;
                        }
                    });
                }

                stepStates[i] = ElementStates.Changing;
                stepStates[minIndex] = ElementStates.Changing;

                [inputArray[i], inputArray[minIndex]] = [inputArray[minIndex], inputArray[i]];

                outputArrays.push(inputArray.slice());
                animationStates.push(stepStates);
            }
        }

    }

    stepStates.forEach((state, index) => {
        if (state === ElementStates.Changing) {
            stepStates[index] = ElementStates.Modified;
        }
    });

    animationStates.push(defaultStep);
    outputArrays.push(inputArray.slice());

    return [animationStates, outputArrays];
};
