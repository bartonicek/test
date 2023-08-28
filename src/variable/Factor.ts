import { ScalarDiscrete } from "../Scalar";
import { sortStrings } from "../funs";
import { Variable } from "./Variable";

export type Labels = Record<number, Record<string, any>>;

export class Factor implements Variable<string | number, ScalarDiscrete> {
  n: number;
  array: number[];

  constructor(
    public indices: number[],
    public indexSet: Set<number>,
    public labelSets: Labels
  ) {
    this.n = this.indices.length;
    this.array = this.indices;
  }

  ith = (index: number) => this.labelSets[this.indices[index]].label;
  push = () => 0;

  static mono = (n: number) => {
    const indices = Array(n).fill(0);
    const indexSet = new Set([0]);
    const labelSets = { 0: {} };

    return new Factor(indices, indexSet, labelSets);
  };

  static from = <T extends string | number>(array: T[], levels?: T[]) => {
    levels = levels ?? Array.from(new Set(array));
    const labs = levels.map((x) => x.toString());
    sortStrings(labs);

    const labelSets: Record<number, { label: string }> = {};
    const labelIndexMap = {} as Record<T, number>;
    const indexSet = new Set<number>();

    for (const [i, v] of Object.entries(levels)) {
      const index = parseInt(i, 10);
      labelSets[index] = { label: `${v}` };
      labelIndexMap[v] = index;
      indexSet.add(index);
    }

    const indices: number[] = [];
    for (const value of array) indices.push(labelIndexMap[value]);

    return new Factor(indices, indexSet, labelSets);
  };
}
