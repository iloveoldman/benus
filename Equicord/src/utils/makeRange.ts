// Equicord/src/utils/makeRange.ts
export function makeRange(min: number, max: number, step = 1): number[] {
    if (step <= 0) throw new Error("step must be > 0");
    const values: number[] = [];
    for (let i = min; i <= max; i += step) {
        values.push(i);
    }
    return values;
}