import React, {useEffect, useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";

interface IQueue<T> {
    enqueue: (item: T | undefined) => void;
    dequeue: () => void;
    peak: () => T | null;
}

class Queue<T> implements IQueue<T> {
    private data: T[];
    private readonly maxSize: number;
    private head: number;
    private tail: number;

    constructor(maxSize: number) {
        this.data = new Array<T>(maxSize);
        this.maxSize = maxSize;
        this.head = 0;
        this.tail = -1;
    }

    enqueue(item: T | undefined) {
        if (item && this.tail < this.maxSize - 1) {
            this.tail++;
            this.data[this.tail] = item;
        }
    }

    dequeue() {
        if (!this.empty()) {
            this.head++;
        }
    }

    peak(): T | null {
        if (!this.empty()) {
            return this.data[this.head];
        }
        return null;
    }

    clear() {
        this.data = new Array<T>(this.maxSize);
        this.head = 0;
        this.tail = -1;
    }

    size(): number {
        return this.tail - this.head + 1;
    }

    empty(): boolean {
        return this.size() === 0;
    }

    items(): T[] {
        return this.data.slice(this.head, this.tail + 1);
    }

    getHeadIndex(): number {
        return this.head;
    }

    getTailIndex(): number {
        return this.tail;
    }
}

const MAX_SIZE: number = 7;
const INT_MAX = 999999;

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
    const [outputArrays, setOutputArrays] = useState<number[][]>([Array(MAX_SIZE).fill(INT_MAX)]);
    const [animationStates, setAnimationStates] = useState<ElementStates[][]>([]);

    useEffect(() => {
    }, [animationStates, outputArrays]);

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
        if (queueRef.current.size() + 1 > MAX_SIZE) return;

        setInputValue("");
        setIsValidInput(false);

        queueRef.current.enqueue(numberValue);
        setQueue(new Queue<number>(MAX_SIZE));

        setIsEmpty(queueRef.current.empty());
        const items = queueRef.current.items();

        const lastArray = outputArrays[outputArrays.length - 1];
        const headIndex = queueRef.current.getHeadIndex();
        lastArray.splice(headIndex, items.length, ...items);
        outputArrays.push(lastArray);

        const stepStates = items.map((_, index) =>
            (index === items.length - 1 ? ElementStates.Changing : ElementStates.Default));

        animationStates.push(stepStates);
        animationStates.push(Array(items.length).fill(ElementStates.Default));

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate();
    }

    const handleDequeue = () => {
        let currentItems = queueRef.current.items();
        queueRef.current.dequeue();
        setQueue(new Queue<number>(MAX_SIZE));

        setIsEmpty(queueRef.current.empty());
        const items = queueRef.current.items();

        const stepStates = currentItems.map((_, index) =>
            (index === queueRef.current.getHeadIndex() ? ElementStates.Changing : ElementStates.Default));
        animationStates.push(stepStates);

        const lastArray = outputArrays[outputArrays.length - 1];
        const headIndex = queueRef.current.getHeadIndex();
        lastArray.splice(headIndex, items.length, ...items);
        outputArrays.push(lastArray);

        animationStates.push(Array(items.length).fill(ElementStates.Default));

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate();
    }
    const handleClear = () => {
        queueRef.current.clear();
        setQueue(new Queue<number>(MAX_SIZE));
        setIsEmpty(queueRef.current.empty());
        setCircleStates(defaultStep);
        setOutputArray(Array(MAX_SIZE).fill(INT_MAX));
    }

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
        setOutputArrays([Array(MAX_SIZE).fill(INT_MAX)]);
    };

    return (
        <SolutionLayout title="Очередь">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "830px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input value={inputValue} maxLength={4} isLimitText={true} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            text={"Добавить"}
                            onClick={handleEnqueue}
                            disabled={!isValidInput}
                    />
                    <Button style={{marginLeft: "12px"}}
                            text={"Удалить"}
                            onClick={handleDequeue}
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
                        {item !== INT_MAX ? (
                            <Circle
                                letter={item.toString()}
                                index={index}
                                state={circleStates[index]}
                                head={index === queueRef.current.getHeadIndex() ? "head" : undefined}
                                tail={index === queueRef.current.getTailIndex() ? "tail" : undefined}
                            />
                        ) : (
                            <Circle index={index} />
                        )}
                    </div>
                ))}
            </div>
        </SolutionLayout>
    );
};
