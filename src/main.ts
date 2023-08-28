import { createEffect, createSignal } from "solid-js";
import { Dataframe } from "./Dataframe";
import { Factor } from "./variable/Factor.ts";
import { ScalarNumeric, View } from "./Scalar";
import { SignalStore } from "./SignalStore.ts";
import { Numeric } from "./variable/Numeric.ts";

const data1 = new Dataframe({
  gender: Factor.from(["m", "m", "f", "f", "m"]),
  income: Numeric.from([100, 150, 100, 200, 300]),
});

const data2 = data1.rename({ var1: "gender", var2: "income" });

const datastore1 = SignalStore.fromDict(data2.cols)
  .bind("width", () => 10)
  .bind("anchor", () => 1)
  .bind("y", ({ var2, width }) => var2().bin({ width: width() }));
