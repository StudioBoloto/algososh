import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";

interface IStack<T> {
    push: (item: T | undefined) => void;
    pop: () => void;
    peak: () => T | null;
}

class Stack<T> implements IStack<T> {
    private data: T[] = [];

    push(item: T | undefined) {
        if (item)
        this.data.push(item);
    }

    pop() {
        this.data.pop();
    }

    peak(): T | null {
        if (this.data.length === 0) {
            return null;
        }
        return this.data[this.data.length - 1];
    }

    clear() {
        this.data = [];
    }

    size(): number {
        return this.data.length;
    }

    empty(): boolean {
        return this.data.length === 0;
    }

    items() {
        return this.data;
    }
}

export const StackPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [stack, setStack] = useState<Stack<number>>(new Stack<number>());
    const stackRef = useRef(stack);

    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>([]);
    const [outputArrays, setOutputArrays] = useState<number[][]>([]);
    const [animationStates, setAnimationStates] = useState<ElementStates[][]>([]);

    useEffect(() => {}, [animationStates, outputArrays]);

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
        if (stackRef.current.size() > 10) return;

        setInputValue("");
        setIsValidInput(false);

        stackRef.current.push(numberValue);
        setStack(new Stack<number>());
        setIsEmpty(stackRef.current.empty());

        const items = stackRef.current.items();

        outputArrays.push(items);
        outputArrays.push(items);

        const stepStates = items.map((_, index) =>
            (index === items.length - 1 ? ElementStates.Changing : ElementStates.Default));

        animationStates.push(stepStates);
        animationStates.push(Array(items.length).fill(ElementStates.Default));

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate();
    };

    const handlePop = () => {
        let currentItems = stackRef.current.items();
        outputArrays.push(currentItems.slice());

        const stepStates = currentItems.map((_, index) =>
            (index === currentItems.length - 1 ? ElementStates.Changing : ElementStates.Default));
        animationStates.push(stepStates);

        stackRef.current.pop();
        setStack(new Stack<number>());
        setIsEmpty(stackRef.current.empty());

        currentItems = stackRef.current.items();
        outputArrays.push(currentItems);
        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate();
    };

    // const handlePeak = () => {
    //     const topElement = stackRef.current.peak();
    //     console.log("Top element:", topElement);
    // };

    const handleClear = () => {
        stackRef.current.clear();
        setStack(new Stack<number>());
        setIsEmpty(stackRef.current.empty());
        setCircleStates([]);
        setOutputArray([]);
    };

    const animate = () => {
        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setCircleStates(stepStates);
                setOutputArray(outputArrays[index]);
            }, delay);
            delay += 500;
        });
        setAnimationStates([]);
        setOutputArrays([]);
    };

    return (
        <SolutionLayout title="Стек">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "830px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input value={inputValue} maxLength={4} isLimitText={true} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            text={"Добавить"}
                            onClick={handlePush}
                            disabled={!isValidInput}
                    />
                    <Button style={{marginLeft: "12px"}}
                            text={"Удалить"}
                            onClick={handlePop}
                            disabled={isEmpty}
                    />
                    <Button style={{marginLeft: "80px"}}
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
