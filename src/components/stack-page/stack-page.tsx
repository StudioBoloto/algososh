import React, {useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {handleClearStack, handlePopStack, handlePushStack, Stack} from "./utils";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export const StackPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [stack, setStack] = useState<Stack<number>>(new Stack<number>());
    const stackRef = useRef(stack);

    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numberValue = parseInt(inputValue, 10);
        if (!isNaN(numberValue) && numberValue >= 1 && numberValue <= 9999) {
            setIsValidInput(true);
            setNumberValue(numberValue);
        } else {
            setIsValidInput(false);
        }
        setInputValue(inputValue);
    };

    const handlePush = () => {
        const [updatedAnimationStates, updatedOutputArrays]
            = handlePushStack(numberValue!, stackRef, setStack, setIsEmpty) as [ElementStates[][], number[][]];

        setInputValue("");
        setIsValidInput(false);

        animate(updatedAnimationStates, updatedOutputArrays);
    };

    const handlePop = () => {
        const [updatedAnimationStates, updatedOutputArrays]
            = handlePopStack(stackRef, setStack, setIsEmpty) as [ElementStates[][], number[][]];

        animate(updatedAnimationStates, updatedOutputArrays);
    };

    const handleClear = () => {
        handleClearStack(stackRef, setStack, setIsEmpty);
        setCircleStates([]);
        setOutputArray([]);
    };

    const animate = (animationStates: ElementStates[][], outputArrays: number[][]) => {
        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setCircleStates(stepStates);
                setOutputArray(outputArrays[index]);
            }, delay);
            delay += SHORT_DELAY_IN_MS;
        });
    };

    return (
        <SolutionLayout title="Стек">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "830px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input value={inputValue} data-testid="input" maxLength={4} isLimitText={true} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            data-testid="button-add"
                            text={"Добавить"}
                            onClick={handlePush}
                            disabled={!isValidInput}
                    />
                    <Button style={{marginLeft: "12px"}}
                            data-testid="button-delete"
                            text={"Удалить"}
                            onClick={handlePop}
                            disabled={isEmpty}
                    />
                    <Button style={{marginLeft: "80px"}}
                            data-testid="button-clear"
                            text={"Очистить"}
                            onClick={handleClear}
                            disabled={isEmpty}
                    />
                </div>
            </div>
            <div style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "48px",
                gap: "16px",
            }}>
                {outputArray.map((item, index) => (
                    <div key={index} style={{ flexDirection: "row" }}>
                        <Circle letter={item.toString()}
                                index={index}
                                state={circleStates[index]}
                                head={index === outputArray.length - 1 ? "top" : undefined}  />
                    </div>
                ))}
            </div>
        </SolutionLayout>
    );
};
