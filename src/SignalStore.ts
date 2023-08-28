import { Accessor, Setter, createSignal } from "solid-js";
import { MapFn } from "./types";

export type Getters = Record<string, Accessor<any>>;
export type Setters = Record<string, Setter<any>>;

type SetterValue<T> = T extends Setter<infer U> ? U : never;
type SetterUpdateFn<T> = T extends Setter<infer U> ? (prev: U) => U : never;

type SetOverload<U extends Setters, K extends keyof U> = {
  (key: K, value: SetterValue<U[K]>): SignalStore<any, any>;
  (key: K, setfn: SetterUpdateFn<U[K]>): SignalStore<any, any>;
};

export class SignalStore<T extends Getters, U extends Setters> {
  constructor(public getters: T, public setters: U) {}

  static fromDict = <V extends Record<string, any>>(dict: V) => {
    const getters = {} as { [key in keyof V]: Accessor<V[key]> };
    for (const [k, v] of Object.entries(dict)) getters[k as keyof V] = () => v;
    return new SignalStore(getters, {});
  };

  bind = <K extends string, V extends any>(
    key: K,
    bindfn: MapFn<T, V>
  ): SignalStore<
    T & { [key in K]: Accessor<V> },
    U & { [key in K]: Setter<V> }
  > => {
    const { getters, setters } = this;

    if (!bindfn.length) {
      const [getter, setter] = createSignal(bindfn(this.getters));
      Object.defineProperty(getters, key, { value: getter });
      Object.defineProperty(setters, key, { value: setter });
      return new SignalStore(getters, setters);
    }

    Object.defineProperty(getters, key, { value: () => bindfn(this.getters) });
    return new SignalStore(getters, this.setters);
  };

  get = (key: keyof T) => this.getters[key]();
  set: SetOverload<U, keyof U> = (key, updatefn) => {
    this.setters[key](updatefn);
    return this;
  };
}
