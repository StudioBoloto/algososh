import { ElementStates } from "../../types/element-states";

export const getReversingStringSteps = (sourceString: string) => {
    const inputArray: string[] = sourceString.split("");
    const outputArray: string[][] = [];
    const animationStates: ElementStates[][] = [];
    let stepStates: ElementStates[] = [];

    for (let i = 0; i < inputArray.length / 2; i++) {
        if (animationStates.length > 0) {
            stepStates = [...animationStates[animationStates.length - 1]];
            stepStates.forEach((state, index) => {
                if (state === ElementStates.Changing) {
                    stepStates[index] = ElementStates.Modified;
                }
            });
        } else {
            stepStates = Array(sourceString.length).fill(ElementStates.Default);
        }

        stepStates[i] = ElementStates.Changing;
        stepStates[inputArray.length - 1 - i] = ElementStates.Changing;

        [inputArray[i], inputArray[inputArray.length - 1 - i]] = [
            inputArray[inputArray.length - 1 - i],
            inputArray[i],
        ];

        outputArray.push(inputArray.slice());
        animationStates.push(stepStates);
    }

    stepStates.forEach((state, index) => {
        if (state === ElementStates.Changing) {
            stepStates[index] = ElementStates.Modified;
        }
    });

    animationStates.push(Array(sourceString.length).fill(ElementStates.Default));
    outputArray.push(inputArray.slice());

    return [animationStates, outputArray];
};
