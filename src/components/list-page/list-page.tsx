import React, {useRef, useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";
import {ElementStates} from "../../types/element-states";
import {ArrowIcon} from "../ui/icons/arrow-icon";
import styles from "./list-page.module.css";
import {
    addToHead,
    addToTail, insertAtIndex,
    INT_MAX,
    LinkedList,
    MAX_SIZE,
    removeAtIndex,
    removeFromHead,
    removeFromTail
} from "./utils";
import {SHORT_DELAY_IN_MS} from "../../constants/delays";

export enum SmallCircleState {
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
    const [smallTopOutputArray, setSmallTopOutputArray] = useState<number[]>([]);
    const [smallBottomOutputArray, setSmallBottomOutputArray] = useState<number[]>([]);
    const [circleStates, setCircleStates] = useState<ElementStates[]>([]);
    const [outputArray, setOutputArray] = useState<number[]>([]);
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

    const animate = (animationStates: ElementStates[][],
                     outputArrays: number[][],
                     smallCircleStates: SmallCircleState[][],
                     smallTopOutputArrays: number[][],
                     smallBottomOutputArrays: number[][],
                     callback: () => void,
    ) => {
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
            delay += SHORT_DELAY_IN_MS;
        });
    };

    const handleAddToHead = () => {
        if (linkedListRef.current.getSize() + 1 > MAX_SIZE) return;
        setAnimationButton("addToHead");
        setIsAnimating(true);

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallTopOutputArrays]
            = addToHead(numberValue!, linkedListRef, setLinkedList, setIsEmpty);

        setInputValue("");
        setIsValidInput(false);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            updatedSmallTopOutputArrays,
            [],
            () => {
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

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallTopOutputArrays]
            = addToTail(numberValue!, linkedListRef, setLinkedList, setIsEmpty);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            updatedSmallTopOutputArrays,
            [],
            () => {
                setIsAnimating(false);
            });
    };

    const handleRemoveFromHead = () => {
        setAnimationButton("removeFromHead");
        setIsAnimating(true);

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallBottomOutputArrays]
            = removeFromHead(linkedListRef, setLinkedList, setIsEmpty);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            [],
            updatedSmallBottomOutputArrays,
            () => {
                setIsAnimating(false);
            });
    };

    const handleRemoveFromTail = () => {
        setAnimationButton("removeFromTail");
        setIsAnimating(true);

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallBottomOutputArrays]
            = removeFromTail(linkedListRef, setLinkedList, setIsEmpty);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            [],
            updatedSmallBottomOutputArrays,
            () => {
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

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallTopOutputArrays]
            = insertAtIndex(numberValue!, indexValue!, linkedListRef, setLinkedList, setIsEmpty);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            updatedSmallTopOutputArrays,
            [],
            () => {
                setIsAnimating(false);
            });
    };

    const handleRemoveAtIndex = () => {
        if (indexValue! >= linkedListRef.current.getSize()) return;
        setAnimationButton("removeAtIndex");
        setIsAnimating(true);

        setInputIndex("");
        setIsValidIndexInput(false);

        const [updatedAnimationStates, updatedOutputArrays, updatedSmallCircleStates, updatedSmallBottomOutputArrays]
            = removeAtIndex(indexValue!, linkedListRef, setLinkedList, setIsEmpty);

        animate(updatedAnimationStates,
            updatedOutputArrays,
            updatedSmallCircleStates,
            [],
            updatedSmallBottomOutputArrays,
            () => {
                setIsAnimating(false);
            });
    };

    return (
        <SolutionLayout title="Связный список">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "952px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input style={{width: "204px"}}
                           data-testid="input"
                           placeholder={"Введите значения"}
                           value={inputValue}
                           maxLength={4}
                           isLimitText={true}
                           onChange={handleInputValueChange}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "180px"}}
                            data-testid="button-add-head"
                            text={"Добавить в head"}
                            disabled={!isValidInput || (isAnimating && animationButton !== "addToHead")}
                            isLoader={(isAnimating && animationButton === "addToHead")}
                            onClick={handleAddToHead}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "175px"}}
                            data-testid="button-add-tail"
                            text={"Добавить в tail"}
                            disabled={!isValidInput || (isAnimating && animationButton !== "addToTail")}
                            isLoader={(isAnimating && animationButton === "addToTail")}
                            onClick={handleAddToTail}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "180px"}}
                            data-testid="button-delete-head"
                            text={"Удалить из head"}
                            disabled={isEmpty || (isAnimating && animationButton !== "removeFromHead")}
                            isLoader={(isAnimating && animationButton === "removeFromHead")}
                            onClick={handleRemoveFromHead}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "175px"}}
                            data-testid="button-delete-tail"
                            text={"Удалить из tail"}
                            disabled={isEmpty || (isAnimating && animationButton !== "removeFromTail")}
                            isLoader={(isAnimating && animationButton === "removeFromTail")}
                            onClick={handleRemoveFromTail}
                    />
                </div>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input style={{width: "204px"}}
                           data-testid="input-index"
                           placeholder={"Введите индекс"}
                           value={inputIndex}
                           maxLength={1}
                           onChange={handleInputIndexChange}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "366px"}}
                            data-testid="button-add-index"
                            text={"Добавить по индексу"}
                            disabled={!isValidIndexInput || !isValidInput}
                            isLoader={(isAnimating && animationButton === "insertAtIndex")}
                            onClick={handleInsertAtIndex}
                    />
                    <Button style={{marginLeft: "12px", minWidth: "366px"}}
                            data-testid="button-delete-index"
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
