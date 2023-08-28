import { Accessor, Setter } from "solid-js";
import { Dataframe } from "./Dataframe";
import { Factor } from "./variable/Factor";
import { Partition } from "./Partition";
import { emptyPOJO, secondArgument } from "./funs";
import { ReduceFn, ScalarsOf, ValueOf, ValuesOf, VarSet } from "./types";
import { Getters, Setters, SignalStore } from "./SignalStore";

export class Wrangler<T extends Getters> {
  store: SignalStore<T, any>;
  partitions: Partition<any>[];

  reducefn: ReduceFn<Record<string, any>, Record<string, any>>;
  reduceInitialFn: () => Record<string, any>;

  constructor(store: SignalStore<T, any>) {
    this.store = store;
    this.partitions = [new Partition(this, Factor.mono(100))];

    this.reducefn = secondArgument;
    this.reduceInitialFn = emptyPOJO;
  }

  reduceData = <U extends VarSet>(
    reducefn: ReduceFn<Record<string, any>, Record<string, any>>,
    initialfn: () => ValuesOf<U>
  ) => {
    this.reducefn = reducefn;
    this.reduceInitialFn = initialfn;
    return this;
  };
}
