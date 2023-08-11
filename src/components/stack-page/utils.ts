import {ElementStates} from "../../types/element-states";

interface IStack<T> {
    push: (item: T | undefined) => void;
    pop: () => void;
    peak: () => T | null;
}

export class Stack<T> implements IStack<T> {
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

export const handleClearStack = (stackRef: React.MutableRefObject<Stack<number>>,
                                 setStack: React.Dispatch<React.SetStateAction<Stack<number>>>,
                                 setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {
    stackRef.current.clear();
    setStack(new Stack<number>());
    setIsEmpty(stackRef.current.empty());

};

export const handlePopStack = (stackRef: React.MutableRefObject<Stack<number>>,
                               setStack: React.Dispatch<React.SetStateAction<Stack<number>>>,
                               setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
) => {

    const outputArrays: number[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays];
};

export const handlePushStack = (numberValue: number,
                                stackRef: React.MutableRefObject<Stack<number>>,
                                setStack: React.Dispatch<React.SetStateAction<Stack<number>>>,
                                setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {

    if (stackRef.current.size() > 10) return;

    const outputArrays: number[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays];
};
