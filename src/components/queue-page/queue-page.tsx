import React, {useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {clear, dequeue, enqueue, INT_MAX, MAX_SIZE, Queue} from "./utils";

export const QueuePage: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [queue, setQueue] = useState<Queue<number>>(new Queue<number>(MAX_SIZE));
    const queueRef = useRef(queue);

    const defaultStep = Array(MAX_SIZE).fill(ElementStates.Default);

    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>(Array(MAX_SIZE).fill(INT_MAX));

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

    const handleEnqueue = () => {
        const [updatedAnimationStates, updatedOutputArrays]
            = enqueue(numberValue!, queueRef, setQueue, setIsEmpty) as [ElementStates[][], number[][]];

        setInputValue("");
        setIsValidInput(false);

        animate(updatedAnimationStates, updatedOutputArrays);
    }

    const handleDequeue = () => {
        const [updatedAnimationStates, updatedOutputArrays]
            = dequeue(queueRef, setQueue, setIsEmpty) as [ElementStates[][], number[][]];

        animate(updatedAnimationStates, updatedOutputArrays);
    }

    const handleClear = () => {
        clear(queueRef, setQueue, setIsEmpty);
        setCircleStates(defaultStep);
        setOutputArray(Array(MAX_SIZE).fill(INT_MAX));
    }

    const animate = (animationStates: ElementStates[][], outputArrays: number[][]) => {
        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setCircleStates(stepStates);
                setOutputArray(outputArrays[index]);
            }, delay);
            delay += 500;
        });
    };

    return (
        <SolutionLayout title="Очередь">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "830px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input value={inputValue} data-testid="input" maxLength={4} isLimitText={true} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            data-testid="button-add"
                            text={"Добавить"}
                            onClick={handleEnqueue}
                            disabled={!isValidInput}
                    />
                    <Button style={{marginLeft: "12px"}}
                            data-testid="button-delete"
                            text={"Удалить"}
                            onClick={handleDequeue}
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
                    <div key={index} style={{flexDirection: "row"}}>
                        {item !== INT_MAX ? (
                            <Circle
                                letter={item.toString()}
                                index={index}
                                state={circleStates[index]}
                                head={index === queueRef.current.getHeadIndex() ? "head" : undefined}
                                tail={index === queueRef.current.getTailIndex() ? "tail" : undefined}
                            />
                        ) : (
                            <Circle index={index}/>
                        )}
                    </div>
                ))}
            </div>
        </SolutionLayout>
    );
};
