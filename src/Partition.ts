import { Dataframe } from "./Dataframe";
import { Factor } from "./variable/Factor";
import { parseScalar } from "./Scalar";
import { Wrangler } from "./Wrangler";
import { emptyPOJO, secondArgument } from "./funs";
import { ReduceFn, ScalarsOf, VarSet } from "./types";

type PartReduceFn<T extends VarSet, U extends VarSet> = ReduceFn<
  ScalarsOf<T>,
  ScalarsOf<VarSet>
>;

export class Partition<T extends VarSet> {
  factor: Factor;

  reducefn: ReduceFn<ScalarsOf<T>, any>;
  reduceInitialFn: () => Record<string, any>;

  constructor(wrangler: Wrangler<any>, factor: Factor) {
    this.factor = factor;

    this.reducefn = wrangler.reducefn;
    this.reduceInitialFn = wrangler.reduceInitialFn;
  }

  compute = <U extends VarSet>() => {
    const { factor, reducefn, reduceInitialFn } = this;

    const result = {} as Record<number, U>;
    for (const index of factor.indexSet) {
      const initial = reduceInitialFn();
      for (const [k, v] of Object.entries(initial)) initial[k] = parseScalar(v);
      result[index] = initial as U;
    }

    for (let i = 0; i < this.n; i++) {
      const row = data.row(i);
      result[factor.indices[i]] = reducefn(result[factor.indices[i]], row);
    }

    return result;
  };
}
