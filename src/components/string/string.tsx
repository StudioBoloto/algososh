import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";

export const StringComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isValidInput, setIsValidInput] = useState(false);
    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const defaultStep = Array(inputValue.length).fill(ElementStates.Default);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 0) {
            setIsValidInput(true);
            setInputValue(event.target.value);
        } else {
            setIsValidInput(false);
            setInputValue("");
        }
    };

    const reverseAnimation = () => {
        const inputArray: string[] = inputValue.split("");
        const outputArray: string[][] = [];
        const animationStates: ElementStates[][] = [];
        let stepStates = [...circleStates];

        for (let i = 0; i < inputArray.length / 2; i++) {
            if (animationStates.length > 0) {
                stepStates = [...animationStates[animationStates.length - 1]];
                stepStates.forEach((state, index) => {
                    if (state === ElementStates.Changing) {
                        stepStates[index] = ElementStates.Modified;
                    }
                });
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

        animationStates.push(defaultStep);
        outputArray.push(inputArray.slice());

        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setCircleStates(stepStates);
                setInputValue(outputArray[index].join(""));
            }, delay);
            delay += 1000;
        });
    };

    return (
        <SolutionLayout title="Строка">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "522px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input maxLength={11} isLimitText={true} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            text={"Развернуть"}
                            onClick={reverseAnimation}
                            disabled={!isValidInput}
                    />
                </div>
            </div>
            <div style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "48px",
                maxWidth: "1040px",
                gap: "16px",
            }}>
                {inputValue.split("").map((letter, index) => (
                    <div key={index} style={{flexDirection: "row"}}>
                        <Circle letter={letter} state={circleStates[index]}/>
                    </div>
                ))}
            </div>
        </SolutionLayout>
    );
};
