import { Variable } from "./variable/Variable";
import { ScalarOf, ScalarsOf } from "./types";

export type Row<T extends Record<string, Variable<any, any>>> = {
  [key in keyof T]: ScalarOf<T[key]>;
};

export class Dataframe<T extends Record<string, Variable<any, any>>> {
  cols: T;
  n: number;
  keys: (keyof T)[];

  constructor(cols: T) {
    this.n = Object.values(cols)[0].n;
    this.cols = cols;
    this.keys = Object.keys(cols);
  }

  rename = <U extends Record<string, keyof T>>(keyMap: U) => {
    const newCols = {} as Record<string, any>;
    for (const [newKey, oldKey] of Object.entries(keyMap)) {
      newCols[newKey] = this.cols[oldKey];
    }
    return new Dataframe(newCols as { [key in keyof U]: T[U[key]] });
  };

  col = (key: keyof T) => this.cols[key];
  row = (index: number) => {
    const result = {} as { [key in keyof T]: ScalarOf<T[key]> };
    for (const key of this.keys) result[key] = this.col(key).ith(index);
    return result;
  };
}
