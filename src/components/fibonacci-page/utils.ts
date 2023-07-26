export const generateFibonacciSequences = (n: number | undefined): string[][] => {
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
