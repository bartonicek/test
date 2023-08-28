import { Scalar } from "../Scalar";

export type Variable<T, U extends Scalar<T>> = {
  n: number;
  array: T[];
  ith: (index: number) => U;
  push: (value: U) => number;
};
