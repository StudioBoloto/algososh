import {ElementStates} from "../../types/element-states";

interface IQueue<T> {
    enqueue: (item: T | undefined) => void;
    dequeue: () => void;
    peak: () => T | null;
}

export class Queue<T> implements IQueue<T> {
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

export const MAX_SIZE: number = 7;
export const INT_MAX = 999999;

export const enqueue = (numberValue: number,
                        queueRef: React.MutableRefObject<Queue<number>>,
                        setQueue: React.Dispatch<React.SetStateAction<Queue<number>>>,
                        setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {

    if (queueRef.current.size() + 1 > MAX_SIZE) return;

    const outputArrays: number[][] = [Array(MAX_SIZE).fill(INT_MAX)];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays];
};

export const clear = (queueRef: React.MutableRefObject<Queue<number>>,
                      setQueue: React.Dispatch<React.SetStateAction<Queue<number>>>,
                      setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {
    queueRef.current.clear();
    setQueue(new Queue<number>(MAX_SIZE));
    setIsEmpty(queueRef.current.empty());
};

export const dequeue = (queueRef: React.MutableRefObject<Queue<number>>,
                        setQueue: React.Dispatch<React.SetStateAction<Queue<number>>>,
                        setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {

    const outputArrays: number[][] = [Array(MAX_SIZE).fill(INT_MAX)];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays];
};
