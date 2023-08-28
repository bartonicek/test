import { Scalar, ScalarNumeric } from "../Scalar";
import { minMax, toInt } from "../funs";
import { Factor, Labels } from "./Factor";
import { Variable } from "./Variable";

type BinOpts = { width?: number; anchor?: number };

export class Numeric implements Variable<number, ScalarNumeric> {
  n: number;
  array: number[];

  constructor(array: number[]) {
    this.n = array.length;
    this.array = array;
  }

  static from = (array: number[]) => new Numeric(array);
  ith = (index: number) => ScalarNumeric.fromView(this.array, index);
  push = (scalar: Scalar<number>) => {
    this.n++;
    const index = this.array.push(scalar.value());
    return index;
  };

  bin = (options?: BinOpts) => {
    const { array } = this;
    const [min, max] = minMax(array);

    let { width, anchor } = options ?? {};
    const nbins = width ? Math.ceil((max - min) / width) + 1 : 10;
    width = options?.width ?? (max - min) / (nbins - 1);
    anchor = options?.anchor ?? min;

    const breakMin = min - width + ((anchor - min) % width);
    const breakMax = max + width - ((max - anchor) % width);

    const breaks = Array(nbins + 2);
    [breaks[0], breaks[breaks.length - 1]] = [breakMin, breakMax];
    for (let i = 1; i < breaks.length - 1; i++) {
      breaks[i] = breakMin + i * width;
    }

    const indices = Array(array.length);
    const labels: Labels = {};
    const meta: Record<string, any> = { min: breakMin, max: breakMax };

    for (let j = 0; j < array.length; j++) {
      const index = breaks.findIndex((br) => br >= array[j]) - 1;
      indices[j] = index;
      if (!labels[index]) labels[index] = { cases: new Set() };
      labels[index].cases.add(j);
    }

    const indexSet = new Set(Object.keys(labels).map(toInt));
    const usedIndices = Array.from(indexSet);
    meta.breaks = [];

    for (let k = 0; k < usedIndices.length; k++) {
      const [lwr, upr] = [usedIndices[k], usedIndices[k] + 1];
      meta.breaks.push(breaks[upr]);
      Object.assign(labels[usedIndices[k]], {
        binMin: breaks[lwr],
        binMax: breaks[upr],
      });
    }

    return new Factor(indices, indexSet, labels);
  };
}
