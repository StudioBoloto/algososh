import React, {useEffect, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Button} from "../ui/button/button";
import {RadioInput} from "../ui/radio-input/radio-input";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {Direction} from "../../types/direction";

enum SortingTypes {
    selectionSort,
    bubbleSort,
}

export const SortingPage: React.FC = () => {
    const initialState: number[] = [2, 17, 34, 100, 50];
    const [inputArray, setInputArray] = useState<number[]>(initialState);
    const [columnStates, setColumnStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>(initialState);
    const [outputArrays, setOutputArrays] = useState<number[][]>([]);
    const [animationStates, setAnimationStates] = useState<ElementStates[][]>([]);
    const [sortingType, setSortingType] = useState<SortingTypes>(SortingTypes.selectionSort);
    const [isAnimatingAscending, setIsAnimatingAscending] = useState(false);
    const [isAnimatingDescending, setIsAnimatingDescending] = useState(false);

    const defaultStep = Array(inputArray.length).fill(ElementStates.Default);

    useEffect(() => {}, [animationStates, outputArrays]);

    const sortAscending = () => {
        setIsAnimatingAscending(true);
        sortingAnimation(Direction.Ascending, () => {
            setIsAnimatingAscending(false);
        });
    };

    const sortDescending = () => {
        setIsAnimatingDescending(true);
        sortingAnimation(Direction.Descending, () => {
            setIsAnimatingDescending(false);
        });
    };

    const handleSelectionSortChange = () => {
        setSortingType(SortingTypes.selectionSort);
    };

    const handleBubbleSortChange = () => {
        setSortingType(SortingTypes.bubbleSort);
    };

    const generateRandomArray = () => {
        const minLen = 3;
        const maxLen = 17;
        const arrLength = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

        const randomArray: number[] = [];
        for (let i = 0; i < arrLength; i++) {
            const randomNumber = Math.floor(Math.random() * 101);
            randomArray.push(randomNumber);
        }
        setInputArray(randomArray);
        setOutputArray(randomArray);
    };

    const sort = (direction: Direction) => {
        const ascending: boolean = direction === Direction.Ascending
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
        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
    };

    const sortingAnimation = (direction: Direction, callback: () => void) => {
        sort(direction);
        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setColumnStates(stepStates);
                setOutputArray(outputArrays[index]);

                if (index === animationStates.length - 1) {
                    callback();
                }

            }, delay);
            delay += 1000;
        });
        setAnimationStates([]);
        setOutputArrays([]);
    };

    return (
        <SolutionLayout title="Сортировка массива">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "980px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <div style={{gap: "40px", display: "flex", flexWrap: "nowrap", alignItems: "center"}}>
                        <RadioInput label={"Выбор"}
                                    checked={sortingType === SortingTypes.selectionSort}
                                    onChange={handleSelectionSortChange}
                        />
                        <RadioInput label={"Пузырёк"}
                                    checked={sortingType === SortingTypes.bubbleSort}
                                    onChange={handleBubbleSortChange}
                        />
                    </div>
                    <Button style={{marginLeft: "52px", minWidth: "210px"}}
                            text={"По возрастанию"}
                            sorting={Direction.Ascending}
                            onClick={sortAscending}
                            isLoader={isAnimatingAscending}
                            disabled={isAnimatingDescending}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "205px"}}
                            text={"По убыванию"}
                            sorting={Direction.Descending}
                            onClick={sortDescending}
                            isLoader={isAnimatingDescending}
                            disabled={isAnimatingAscending}
                    />
                    <Button style={{marginLeft: "80px", minWidth: "205px"}}
                            text={"Новый массив"}
                            onClick={generateRandomArray}
                            disabled={isAnimatingAscending || isAnimatingDescending}
                    />
                </div>
                <div style={{
                    display: "inline-flex",
                    alignItems: "flex-end",
                    gap: "10px",
                    minHeight: "320px",
                    marginRight: "auto",
                    marginLeft: "auto",
                    marginTop: "48px",
                }}>
                    {outputArray.map((value, index) => (
                        <div key={index}>
                            <Column index={value} state={columnStates[index]}/>
                        </div>
                    ))}
                </div>
            </div>
        </SolutionLayout>
    );
};
