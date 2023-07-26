import {ElementStates} from "../../types/element-states";
import {SmallCircleState} from "./list-page";

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

export class LinkedList<T> implements ILinkedList<T> {
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

export const MAX_SIZE: number = 10;
export const INT_MAX = 999999;

export const addToHead = (
    numberValue: number,
    linkedListRef: React.MutableRefObject<LinkedList<number>>,
    setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {

    const smallTopOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallTopOutputArrays];
};

export const addToTail = (
    numberValue: number,
    linkedListRef: React.MutableRefObject<LinkedList<number>>,
    setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {
    const smallTopOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallTopOutputArrays];
};

export const insertAtIndex = (numberValue: number, indexValue: number,
                              linkedListRef: React.MutableRefObject<LinkedList<number>>,
                              setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
                              setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {
    const smallTopOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallTopOutputArrays];
}

export const removeFromHead = (
    linkedListRef: React.MutableRefObject<LinkedList<number>>,
    setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {
    const smallBottomOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallBottomOutputArrays];
};

export const removeFromTail = (
    linkedListRef: React.MutableRefObject<LinkedList<number>>,
    setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {
    const smallBottomOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallBottomOutputArrays];
};

export const removeAtIndex = (
    indexValue: number,
    linkedListRef: React.MutableRefObject<LinkedList<number>>,
    setLinkedList: React.Dispatch<React.SetStateAction<LinkedList<number>>>,
    setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
): [
    ElementStates[][],
    number[][],
    SmallCircleState[][],
    number[][],
] => {
    const smallBottomOutputArrays: number[][] = [];
    const outputArrays: number[][] = [];
    const smallCircleStates: SmallCircleState[][] = [];
    const animationStates: ElementStates[][] = [];

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

    return [animationStates, outputArrays, smallCircleStates, smallBottomOutputArrays];
}
