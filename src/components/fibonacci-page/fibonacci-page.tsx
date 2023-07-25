import React, {useState} from "react";
import {SolutionLayout} from "../ui/solution-layout/solution-layout";
import {Input} from "../ui/input/input";
import {Button} from "../ui/button/button";
import {Circle} from "../ui/circle/circle";

export const FibonacciPage: React.FC = () => {
    const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
    const [isValidInput, setIsValidInput] = useState(false);
    const [outputArray, setOutputArray] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const numberValue = parseInt(inputValue, 10);
        if (!isNaN(numberValue) && numberValue >= 1 && numberValue <= 19) {
            setNumberValue(numberValue);
            setIsValidInput(true);
        } else {
            setNumberValue(numberValue);
            setIsValidInput(false);
        }
    };

    const generateFibonacciSequences = (n: number | undefined): string[][] => {
        if (n === undefined) return [];

        const outputArray: string[][] = [];
        const sequence: number[] = [];

        for (let i = 0; i < 2; i++) {
            sequence.push(1);
            outputArray.push(sequence.map((num) => num.toString()));
        }

        for (let i = 2; i <= n; i++) {
            sequence.push(sequence[i - 1] + sequence[i - 2]);
            outputArray.push(sequence.map((num) => num.toString()));
        }

        return outputArray;
    };

    const fibonacciAnimation = () => {
        const animationStates = generateFibonacciSequences(numberValue);
        let delay = 0;
        animationStates.forEach((state) => {
            setTimeout(() => {
                setOutputArray(state);
            }, delay);
            delay += 1000;
        });
    };

    return (
        <SolutionLayout title="Последовательность Фибоначчи">
            <div style={{marginRight: "auto", marginLeft: "auto", maxWidth: "522px"}}>
                <div style={{display: "flex", flexWrap: "nowrap"}}>
                    <Input maxLength={2} max={19} onChange={handleInputChange}/>
                    <Button style={{marginLeft: "12px"}}
                            text={"Рассчитать"}
                            onClick={fibonacciAnimation}
                            disabled={!isValidInput}/>
                </div>
                <p style={{
                    color: "#3D3D3D",
                    maxWidth: "210px",
                    marginLeft: "16px",
                }}>Максимальное число — 19</p>
            </div>
            <div style={{
                display: "inline-flex",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "48px",
                maxWidth: "944px",
                gap: "16px",
                flexWrap: "wrap",
            }}>
                {outputArray.map((letter, index) => (
                    <div key={index} style={{flexDirection: "row"}}>
                        <Circle letter={letter}/>
                        <p>{index}</p>
                    </div>
                ))}
            </div>
        </SolutionLayout>
    );
};
