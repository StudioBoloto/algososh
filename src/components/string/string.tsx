import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {getReversingStringSteps} from "./utils";

export const StringComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isValidInput, setIsValidInput] = useState(false);
    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);

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
        const [animationStates, outputArray] = getReversingStringSteps(inputValue) as [ElementStates[][], string[][]];

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
