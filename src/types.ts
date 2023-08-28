import { Scalar, ScalarNumeric } from "./Scalar";
import { Numeric, Variable } from "./variable/Variable";

export type Primitive = number | string | boolean;

export type ReduceFn<T, U> = (prev: U, next: T) => U;
export type MapFn<T, U> = (next: T) => U;

export type VarSet = Record<string, Variable<any, any>>;

export type ValueOf<T> = T extends Numeric ? number : never;
export type ScalarOf<T> = T extends Numeric ? ScalarNumeric : never;
export type VariableOf<T> = T extends ScalarNumeric ? Numeric : never;

export type ValuesOf<T extends Record<string, Variable<any, any>>> = {
  [key in keyof T]: ValueOf<T[key]>;
};
export type ScalarsOf<T extends Record<string, Variable<any, any>>> = {
  [key in keyof T]: ScalarOf<T[key]>;
};
export type VariablesOf<T extends Record<string, Scalar<any>>> = {
  [key in keyof T]: VariableOf<T[key]>;
};
