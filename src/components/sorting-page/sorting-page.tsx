import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Button} from "../ui/button/button";
import {RadioInput} from "../ui/radio-input/radio-input";
import {Column} from "../ui/column/column";
import {ElementStates} from "../../types/element-states";
import {Direction} from "../../types/direction";
import {generateRandomArray, sortArray} from "./utils";
import {DELAY_IN_MS} from "../../constants/delays";

export enum SortingTypes {
    selectionSort,
    bubbleSort,
}

const initialState: number[] = [2, 17, 34, 100, 50];

export const SortingPage: React.FC = () => {
    const [inputArray, setInputArray] = useState<number[]>(initialState);
    const [columnStates, setColumnStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>(initialState);
    const [sortingType, setSortingType] = useState<SortingTypes>(SortingTypes.selectionSort);
    const [isAnimatingAscending, setIsAnimatingAscending] = useState(false);
    const [isAnimatingDescending, setIsAnimatingDescending] = useState(false);

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

    const handleGenerateArray = () => {
        const randomArray = generateRandomArray();
        setInputArray(randomArray);
        setOutputArray(randomArray);
    }

    const sortingAnimation = (direction: Direction, callback: () => void) => {
        const [updatedAnimationStates, updatedOutputArrays] =
            sortArray(inputArray, sortingType, direction) as [ElementStates[][], number[][]];

        let delay = 0;
        updatedAnimationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setColumnStates(stepStates);
                setOutputArray(updatedOutputArrays[index]);

                if (index === updatedAnimationStates.length - 1) {
                    callback();
                }
            }, delay);
            delay += DELAY_IN_MS;
        });
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
                            onClick={handleGenerateArray}
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
