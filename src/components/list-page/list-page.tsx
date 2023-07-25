import React, {useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {ArrowIcon} from "../ui/icons/arrow-icon";
import styles from "./list-page.module.css";

class Node<T> {
    value: T;
    next: Node<T> | null;

    constructor(value: T, next: Node<T> | null = null) {
        this.value = value;
        this.next = next;
    }
}

interface ILinkedList<T> {
    addToHead: (value: T) => void;
    addToTail: (value: T) => void;
    removeFromHead: () => void;
    removeFromTail: () => void;
    insertAtIndex: (index: number, value: T) => void;
    removeFromIndex: (index: number) => void;
    getSize: () => number;
    isEmpty: () => boolean;
    items: () => T[];
    getHeadValue: () => T | null;
    getTailValue: () => T | null;
}

class LinkedList<T> implements ILinkedList<T> {
    private head: Node<T> | null;
    private tail: Node<T> | null;
    private size: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    addToHead(value: T): void {
        const newNode = new Node<T>(value, this.head);
        this.head = newNode;
        if (!this.tail) {
            this.tail = newNode;
        }
        this.size++;
    }

    addToTail(value: T): void {
        const newNode = new Node<T>(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    removeFromHead(): void {
        if (this.head) {
            this.head = this.head.next;
            this.size--;
            if (!this.head) {
                this.tail = null;
            }
        }
    }

    removeFromTail(): void {
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else {
            let currentNode = this.head;
            while (currentNode?.next !== this.tail) {
                currentNode = currentNode?.next || null;
            }
            if (currentNode) {
                currentNode.next = null;
                this.tail = currentNode;
            }
        }
        this.size--;
    }

    insertAtIndex(index: number, value: T): void {
        if (index < 0 || index > this.size) {
            throw new Error("Index out of bounds");
        }
        if (index === 0) {
            this.addToHead(value);
        } else if (index === this.size) {
            this.addToTail(value);
        } else {
            let currentNode = this.head;
            for (let i = 0; i < index - 1; i++) {
                currentNode = currentNode?.next || null;
            }
            if (currentNode) {
                currentNode.next = new Node<T>(value, currentNode.next);
                this.size++;
            }
        }
    }

    removeFromIndex(index: number): void {
        if (index < 0 || index >= this.size) {
            throw new Error("Index out of bounds");
        }
        if (index === 0) {
            this.removeFromHead();
        } else if (index === this.size - 1) {
            this.removeFromTail();
        } else {
            let currentNode = this.head;
            for (let i = 0; i < index - 1; i++) {
                currentNode = currentNode?.next || null;
            }
            if (currentNode && currentNode.next) {
                currentNode.next = currentNode.next.next;
                this.size--;
            }
        }
    }

    getSize(): number {
        return this.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    items(): T[] {
        const result: T[] = [];
        let currentNode = this.head;
        while (currentNode) {
            result.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return result;
    }

    getHeadValue(): T | null {
        return this.head ? this.head.value : null;
    }

    getTailValue(): T | null {
        return this.tail ? this.tail.value : null;
    }
}

const MAX_SIZE: number = 10;
const INT_MAX = 999999;

enum SmallCircleState {
    Visible = "visible",
    Invisible = "invisible",
}

export const ListPage: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputIndex, setInputIndex] = useState<string>("");
    const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
    const [indexValue, setIndexValue] = useState<number | undefined>(undefined);
    const [isValidInput, setIsValidInput] = useState(false);
    const [isValidIndexInput, setIsValidIndexInput] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const [linkedList, setLinkedList] = useState<LinkedList<number>>(new LinkedList<number>());
    const linkedListRef = useRef(linkedList);

    const [smallCircleState, setSmallCircleState] = useState<SmallCircleState[]>([]);
    const [smallCircleStates, setSmallCircleStates] = useState<SmallCircleState[][]>([]);
    const [smallTopOutputArray, setSmallTopOutputArray] = useState<number[]>([]);
    const [smallTopOutputArrays, setSmallTopOutputArrays] = useState<number[][]>([]);
    const [smallBottomOutputArray, setSmallBottomOutputArray] = useState<number[]>([]);
    const [smallBottomOutputArrays, setSmallBottomOutputArrays] = useState<number[][]>([]);

    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>([]);
    const [outputArrays, setOutputArrays] = useState<number[][]>([]);
    const [animationStates, setAnimationStates] = useState<ElementStates[][]>([]);

    const [isAnimating, setIsAnimating] = useState(false);
    const [animationButton, setAnimationButton] = useState("");


    const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleInputIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputIndex = event.target.value;
        const indexValue = parseInt(inputIndex, 10);
        if (!isNaN(indexValue) && indexValue >= 0 && indexValue <= 9) {
            setIsValidIndexInput(true);
            setIndexValue(indexValue);
        } else {
            setIsValidIndexInput(false);
        }
        setInputIndex(inputIndex);
    };

    const animate = (callback: () => void) => {
        let delay = 0;
        animationStates.forEach((stepStates, index) => {
            setTimeout(() => {
                setCircleStates(stepStates);
                setOutputArray(outputArrays[index]);

                setSmallTopOutputArray(smallTopOutputArrays[index]);
                setSmallBottomOutputArray(smallBottomOutputArrays[index]);
                setSmallCircleState(smallCircleStates[index]);

                if (index === animationStates.length - 1) {
                    callback();
                    setAnimationButton("");
                }

            }, delay);
            delay += 500;
        });
        setAnimationStates([]);
        setOutputArrays([]);

        setSmallTopOutputArrays([]);
        setSmallBottomOutputArrays([]);
        setSmallCircleStates([]);
    };

    const handleAddToHead = () => {
        if (linkedListRef.current.getSize() + 1 > MAX_SIZE) return;
        setAnimationButton("addToHead");
        setIsAnimating(true);
        setInputValue("");
        setIsValidInput(false);

        let currentItems = linkedListRef.current.items();
        outputArrays.push([...currentItems.slice()]);
        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));

        currentItems[0] = numberValue!;
        smallTopOutputArrays.push([...currentItems.slice()]);
        smallTopOutputArrays.push([...currentItems.slice()]);
        smallTopOutputArrays.push(currentItems.slice());

        const defaultCircleStates = Array(currentItems.length).fill(SmallCircleState.Invisible);
        smallCircleStates.push([SmallCircleState.Visible, ...defaultCircleStates.slice()]);
        smallCircleStates.push([SmallCircleState.Invisible, ...defaultCircleStates.slice()]);
        smallCircleStates.push(defaultCircleStates.slice());

        linkedListRef.current.addToHead(numberValue!);
        setLinkedList(new LinkedList<number>());
        const items = linkedListRef.current.items();
        setIsEmpty(linkedListRef.current.isEmpty());

        outputArrays.push(items);
        outputArrays.push(items);

        const stepStates = items.map((_, index) =>
            (index === 0 ? ElementStates.Modified : ElementStates.Default));

        animationStates.push(stepStates);
        animationStates.push(Array(items.length).fill(ElementStates.Default));

        setSmallTopOutputArrays(smallTopOutputArrays);
        setSmallCircleStates(smallCircleStates);

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });
    };

    const handleAddToTail = () => {
        if (linkedListRef.current.getSize() + 1 > MAX_SIZE) return;
        if (linkedListRef.current.isEmpty()) {
            handleAddToHead();
            return;
        }
        setAnimationButton("addToTail");
        setIsAnimating(true);
        setInputValue("");
        setIsValidInput(false);

        let currentItems = linkedListRef.current.items();
        outputArrays.push([...currentItems.slice()]);
        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));

        currentItems[currentItems.length - 1] = numberValue!;
        smallTopOutputArrays.push([...currentItems.slice()]);
        smallTopOutputArrays.push([...currentItems.slice()]);
        smallTopOutputArrays.push(currentItems.slice());

        const defaultCircleStates = Array(currentItems.length).fill(SmallCircleState.Invisible);
        const lastIndex = defaultCircleStates.length - 1;

        defaultCircleStates[lastIndex] = SmallCircleState.Visible;
        smallCircleStates.push([...defaultCircleStates.slice()]);

        defaultCircleStates[lastIndex] = SmallCircleState.Invisible;
        smallCircleStates.push([...defaultCircleStates.slice()]);
        smallCircleStates.push(defaultCircleStates.slice());

        linkedListRef.current.addToTail(numberValue!);
        setLinkedList(new LinkedList<number>());
        setIsEmpty(linkedListRef.current.isEmpty());
        const items = linkedListRef.current.items();
        setIsEmpty(linkedListRef.current.isEmpty());

        outputArrays.push(items);
        outputArrays.push(items);

        const stepStates = items.map((_, index) =>
            (index === items.length - 1 ? ElementStates.Modified : ElementStates.Default));

        animationStates.push(stepStates);
        animationStates.push(Array(items.length).fill(ElementStates.Default));

        setSmallTopOutputArrays(smallTopOutputArrays);
        setSmallCircleStates(smallCircleStates);

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });

    };

    const handleRemoveFromHead = () => {
        setAnimationButton("removeFromHead");
        setIsAnimating(true);
        let currentItems = linkedListRef.current.items();
        const defaultCircleStates = Array(currentItems.length).fill(SmallCircleState.Invisible);

        smallBottomOutputArrays.push([...currentItems.slice()]);
        smallBottomOutputArrays.push([...currentItems.slice()]);

        defaultCircleStates[0] = SmallCircleState.Visible;
        smallCircleStates.push([...defaultCircleStates.slice()]);

        defaultCircleStates[0] = SmallCircleState.Invisible;
        smallCircleStates.push([...defaultCircleStates.slice()]);

        currentItems[0] = INT_MAX;
        outputArrays.push(currentItems.slice());

        linkedListRef.current.removeFromHead();
        setLinkedList(new LinkedList<number>());
        setIsEmpty(linkedListRef.current.isEmpty());

        currentItems = linkedListRef.current.items();
        outputArrays.push(currentItems);

        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));
        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));

        setSmallBottomOutputArrays(smallTopOutputArrays);
        setSmallCircleStates(smallCircleStates);

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });
    };

    const handleRemoveFromTail = () => {
        setAnimationButton("removeFromTail");
        setIsAnimating(true);
        let currentItems = linkedListRef.current.items();
        const lastIndex = currentItems.length - 1;
        const defaultCircleStates = Array(currentItems.length).fill(SmallCircleState.Invisible);

        smallBottomOutputArrays.push([...currentItems.slice()]);
        smallBottomOutputArrays.push([...currentItems.slice()]);

        defaultCircleStates[lastIndex] = SmallCircleState.Visible;
        smallCircleStates.push([...defaultCircleStates.slice()]);

        defaultCircleStates[lastIndex] = SmallCircleState.Invisible;
        smallCircleStates.push([...defaultCircleStates.slice()]);

        currentItems[lastIndex] = INT_MAX;
        outputArrays.push(currentItems.slice());

        linkedListRef.current.removeFromTail();
        setLinkedList(new LinkedList<number>());
        setIsEmpty(linkedListRef.current.isEmpty());

        currentItems = linkedListRef.current.items();
        outputArrays.push(currentItems);

        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));
        animationStates.push(Array(currentItems.length).fill(ElementStates.Default));

        setSmallBottomOutputArrays(smallTopOutputArrays);
        setSmallCircleStates(smallCircleStates);

        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });
    };

    const handleInsertAtIndex = () => {
        if (indexValue! >= linkedListRef.current.getSize()) return;
        if (linkedListRef.current.getSize() + 1 > MAX_SIZE) return;
        setAnimationButton("insertAtIndex");
        setIsAnimating(true);
        setInputValue("");
        setIsValidInput(false);

        setInputIndex("");
        setIsValidIndexInput(false);

        const currentItems = linkedListRef.current.items();
        outputArrays.push([...currentItems.slice()]);

        const defaultCircleStates = Array(linkedListRef.current.getSize()).fill(ElementStates.Default);
        const defaultSmallCircleStates = Array(linkedListRef.current.getSize()).fill(SmallCircleState.Invisible);

        animationStates.push([...defaultCircleStates.slice()]);
        defaultSmallCircleStates[0] = SmallCircleState.Visible;
        smallCircleStates.push([...defaultSmallCircleStates.slice()]);
        smallTopOutputArrays.push(Array(linkedListRef.current.getSize()).fill(numberValue!));

        for (let i = 1; i <= indexValue!; ++i) {
            defaultSmallCircleStates[i - 1] = SmallCircleState.Invisible;
            defaultSmallCircleStates[i] = SmallCircleState.Visible;
            smallCircleStates.push([...defaultSmallCircleStates.slice()]);
            smallTopOutputArrays.push(Array(linkedListRef.current.getSize()).fill(numberValue!));
            defaultCircleStates[i - 1] = ElementStates.Changing;
            animationStates.push([...defaultCircleStates.slice()]);
            outputArrays.push([...currentItems.slice()]);
        }

        linkedListRef.current.insertAtIndex(indexValue!, numberValue!);
        setLinkedList(new LinkedList<number>());
        setIsEmpty(linkedListRef.current.isEmpty());

        smallTopOutputArrays.push(Array(linkedListRef.current.getSize()).fill(numberValue!));
        smallTopOutputArrays.push(Array(linkedListRef.current.getSize()).fill(numberValue!));
        defaultSmallCircleStates[indexValue!] = SmallCircleState.Invisible;
        defaultSmallCircleStates.push(SmallCircleState.Invisible);
        smallCircleStates.push([...defaultSmallCircleStates.slice()]);
        smallCircleStates.push([...defaultSmallCircleStates.slice()]);

        const items = linkedListRef.current.items();
        outputArrays.push(items);
        outputArrays.push(items);
        const currentCircleStates = Array(linkedListRef.current.getSize()).fill(ElementStates.Default);

        currentCircleStates[indexValue!] = ElementStates.Modified;
        animationStates.push([...currentCircleStates.slice()]);
        animationStates.push(Array(linkedListRef.current.getSize()).fill(ElementStates.Default));

        setSmallTopOutputArrays(smallTopOutputArrays);
        setSmallCircleStates(smallCircleStates);
        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });
    };

    const handleRemoveAtIndex = () => {
        if (indexValue! >= linkedListRef.current.getSize()) return;
        setAnimationButton("removeAtIndex");
        setIsAnimating(true);

        setInputIndex("");
        setIsValidIndexInput(false);

        let previousItems = linkedListRef.current.items();
        const previousCircleStates = Array(linkedListRef.current.getSize()).fill(ElementStates.Default);
        const previousSmallCircleStates = Array(linkedListRef.current.getSize()).fill(SmallCircleState.Invisible);

        for (let i = 0; i <= indexValue!; ++i) {
            smallCircleStates.push([...previousSmallCircleStates.slice()]);
            smallBottomOutputArrays.push(Array(linkedListRef.current.getSize()).fill(previousItems[i]));
            previousCircleStates[i] = ElementStates.Changing;
            animationStates.push([...previousCircleStates.slice()]);
            outputArrays.push([...previousItems.slice()]);
        }

        let currentItems = linkedListRef.current.items();
        const defaultCircleStates = Array(currentItems.length).fill(ElementStates.Default);
        const defaultSmallCircleStates = Array(currentItems.length).fill(SmallCircleState.Invisible);

        smallBottomOutputArrays.push([...currentItems.slice()]);
        smallBottomOutputArrays.push([...currentItems.slice()]);

        defaultSmallCircleStates[indexValue!] = SmallCircleState.Visible;
        smallCircleStates.push([...defaultSmallCircleStates.slice()]);

        defaultSmallCircleStates[indexValue!] = SmallCircleState.Invisible;
        smallCircleStates.push([...defaultSmallCircleStates.slice()]);

        animationStates.push([...defaultCircleStates.slice()]);

        currentItems[indexValue!] = INT_MAX;
        outputArrays.push(currentItems.slice());

        linkedListRef.current.removeFromIndex(indexValue!);
        setLinkedList(new LinkedList<number>());
        setIsEmpty(linkedListRef.current.isEmpty());

        const items = linkedListRef.current.items();
        outputArrays.push(items);
        const currentCircleStates = Array(linkedListRef.current.getSize()).fill(ElementStates.Default);
        animationStates.push([...currentCircleStates.slice()]);

        setSmallBottomOutputArrays(smallBottomOutputArrays);
        setSmallCircleStates(smallCircleStates);
        setAnimationStates(animationStates);
        setOutputArrays(outputArrays);
        animate(() => {
            setIsAnimating(false);
        });

    };

    return (
        <SolutionLayout title="Связный список">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "952px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input style={{width: "204px"}}
                           placeholder={"Введите значения"}
                           value={inputValue}
                           maxLength={4}
                           isLimitText={true}
                           onChange={handleInputValueChange}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "180px"}}
                            text={"Добавить в head"}
                            disabled={!isValidInput || (isAnimating && animationButton !== "addToHead")}
                            isLoader={(isAnimating && animationButton === "addToHead")}
                            onClick={handleAddToHead}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "175px"}}
                            text={"Добавить в tail"}
                            disabled={!isValidInput || (isAnimating && animationButton !== "addToTail")}
                            isLoader={(isAnimating && animationButton === "addToTail")}
                            onClick={handleAddToTail}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "180px"}}
                            text={"Удалить из head"}
                            disabled={isEmpty || (isAnimating && animationButton !== "removeFromHead")}
                            isLoader={(isAnimating && animationButton === "removeFromHead")}
                            onClick={handleRemoveFromHead}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "175px"}}
                            text={"Удалить из tail"}
                            disabled={isEmpty || (isAnimating && animationButton !== "removeFromTail")}
                            isLoader={(isAnimating && animationButton === "removeFromTail")}
                            onClick={handleRemoveFromTail}
                    />
                </div>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input style={{width: "204px"}}
                           placeholder={"Введите индекс"}
                           value={inputIndex}
                           maxLength={1}
                           onChange={handleInputIndexChange}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "366px"}}
                            text={"Добавить по индексу"}
                            disabled={!isValidIndexInput || !isValidInput}
                            isLoader={(isAnimating && animationButton === "insertAtIndex")}
                            onClick={handleInsertAtIndex}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "366px"}}
                            text={"Удалить по индексу"}
                            disabled={!isValidIndexInput || isEmpty}
                            isLoader={(isAnimating && animationButton === "removeAtIndex")}
                            onClick={handleRemoveAtIndex}
                    />
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", marginTop: "56px",}}>
                <div style={{
                    display: "inline-flex",
                    position: "relative",
                    marginRight: "auto",
                    marginLeft: "auto",
                    alignContent: "center",
                    marginBottom: "8px",
                    gap: "80px",
                    zIndex: 1,
                }}>
                    {smallTopOutputArray && smallTopOutputArray.map((item, index) => (
                        <div key={index}>
                            <Circle letter={item.toString()}
                                    isSmall={true} state={ElementStates.Changing}
                                    extraClass={`${styles[smallCircleState[index]]}`}/>
                        </div>
                    ))}
                    {!smallTopOutputArray &&
                        <Circle isSmall={true} extraClass={`${styles[SmallCircleState.Invisible]}`}/>}
                </div>
                <div style={{
                    display: "inline-flex",
                    position: "relative",
                    marginRight: "auto",
                    marginLeft: "auto",
                    marginBottom: "38px",
                    alignContent: "center",
                    gap: "16px",
                    zIndex: 0,
                }}>
                    {outputArray && outputArray.map((item, index) => (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "16px",
                        }}>
                            {item !== INT_MAX ? (
                                <Circle letter={item.toString()}
                                        index={index}
                                        state={circleStates[index]}
                                        head={index === 0 ? "head" : undefined}
                                        tail={index === outputArray.length - 1 ? "tail" : undefined}
                                />
                            ) : (
                                <Circle index={index}
                                        head={index === 0 ? "head" : undefined}
                                        tail={index === outputArray.length - 1 ? "tail" : undefined}
                                />
                            )}
                            {index !== outputArray.length - 1 && <ArrowIcon/>}
                        </div>
                    ))}
                </div>
                <div style={{
                    display: "inline-flex",
                    marginRight: "auto",
                    marginLeft: "auto",
                    alignContent: "center",
                    gap: "80px",
                    position: "relative",
                    zIndex: 1,
                }}>
                    {smallBottomOutputArray && smallBottomOutputArray.map((item, index) => (
                        <div key={index}>
                            <Circle letter={item.toString()}
                                    isSmall={true} state={ElementStates.Changing}
                                    extraClass={`${styles[smallCircleState[index]]}`}/>
                        </div>
                    ))}
                    {!smallBottomOutputArray &&
                        <Circle isSmall={true} extraClass={`${styles[SmallCircleState.Invisible]}`}/>}
                </div>
            </div>
        </SolutionLayout>
    );
};
