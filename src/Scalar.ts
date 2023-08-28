import { Accessor } from "solid-js";
import { Variable } from "./variable/Variable";
import { Primitive } from "./types";

export type Scalar<T> = { value: () => T };

export class Value<T> implements Scalar<T> {
  constructor(public val: T) {}
  static from = <T extends any>(value: T) => new Value(value);
  value = () => this.val;
}

export class View<T> implements Scalar<T> {
  constructor(public array: T[], public index: number) {}
  static from = <T extends Primitive>(array: T[], index: number) => {
    return new View(array, index);
  };
  value = () => this.array[this.index];
}

type ValueLike<T> = Value<T> | View<T>;

export const parseScalar = (x: string | number) => {
  if (typeof x === "number") return ScalarNumeric.fromValue(x);
  else return ScalarDiscrete.fromValue(x);
};

export class ScalarNumeric implements Scalar<number> {
  constructor(public valueLike: ValueLike<number>) {}

  static from = (valueLike: ValueLike<number>) => new ScalarNumeric(valueLike);
  static fromValue = (value: number) => ScalarNumeric.from(Value.from(value));
  static fromView = (array: number[], index: number) => {
    return ScalarNumeric.from(View.from(array, index));
  };

  value = () => this.valueLike.value();

  add = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() + other.value());
  };

  times = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() * other.value());
  };

  divideBy = (other: ScalarNumeric) => {
    return ScalarNumeric.fromValue(this.value() / other.value());
  };
}

export class ScalarDiscrete implements Scalar<number | string> {
  constructor(public valueLike: ValueLike<number | string>) {}

  value = () => this.valueLike.value();

  static from = (valueLike: ValueLike<number | string>) => {
    return new ScalarDiscrete(valueLike);
  };
  static fromView = <T extends string | number>(array: T[], index: number) => {
    return ScalarDiscrete.from(View.from(array, index));
  };
  static fromValue = <T extends string | number>(value: T) => {
    return ScalarDiscrete.from(Value.from(value));
  };

  paste = (other: ScalarDiscrete) => {
    return ScalarDiscrete.fromValue(`${this.value()}${other.value()}`);
  };
}
