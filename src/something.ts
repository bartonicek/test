// type Scalar<T> = { value: T; toVariable(): Variable<T, Scalar<T>> };
// type ScalarOf<T> = T extends Numeric ? ScalarNumeric : never;
// type VariableOf<T> = T extends ScalarNumeric ? Numeric : never;
// type Row<T extends Record<string, Variable<any, any>>> = {
//   [key in keyof T]: ScalarOf<T[key]>;
// };

// type ScalarsOf<T extends Record<string, Scalar<any>>> = {
//   [key in keyof T]: ScalarOf<T[key]>;
// };
// type VariablesOf<T extends Record<string, Scalar<any>>> = {
//   [key in keyof T]: VariableOf<T[key]>;
// };

// class ScalarNumeric implements Scalar<number> {
//   value: number;

//   constructor(value: number) {
//     this.value = value;
//   }

//   toVariable = () => new Numeric([this.value]);

//   add = (other: ScalarNumeric) => {
//     return new ScalarNumeric(this.value + other.value);
//   };

//   divideBy = (other: ScalarNumeric) => {
//     return new ScalarNumeric(this.value / other.value);
//   };
// }

// type Variable<T, U extends Scalar<T>> = {
//   n: number;
//   data: T[];
//   ith: (index: number) => U;
//   push: (value: Scalar<T>) => number;
// };

// class Numeric implements Variable<number, ScalarNumeric> {
//   n: number;
//   data: number[];

//   constructor(data: number[]) {
//     this.n = data.length;
//     this.data = data;
//   }

//   ith = (index: number) => new ScalarNumeric(this.data[index]);
//   push = (value: Scalar<number>) => {
//     this.n++;
//     const index = this.data.push(value.value);
//     return index;
//   };
// }

// const x = new Numeric([1, 2, 3, 4]);
// const y = new Numeric([4, 5, 6, 7]);
// const vars = { x, y };

// class Dataframe<T extends Record<string, Variable<any, any>>> {
//   data: T;
//   n: number;
//   keys: string[];

//   constructor(data: T) {
//     this.n = Object.values(data)[0].n;
//     this.data = data;
//     this.keys = Object.keys(data);
//   }

//   row = (index: number) => {
//     const result = {} as ScalarsOf<T>;
//     for (const [k, v] of Object.entries(this.data)) {
//       result[k as keyof T] = v.ith(index);
//     }
//     return result;
//   };
// }

// class Wrangler<T extends Record<string, Variable<any, any>>> {
//   n: number;
//   data: Dataframe<T>;

//   constructor(data: Dataframe<T>) {
//     this.n = data.n;
//     this.data = data;
//   }

//   compute = <U extends Record<string, Scalar<any>>>(
//     mapfn: (row: Row<T>) => U
//   ) => {
//     const { n, data } = this;
//     const firstRow = mapfn(data.row(0));
//     const result = {} as {
//       [key in keyof typeof firstRow]: (typeof firstRow)[key] extends ScalarNumeric
//         ? Numeric
//         : never;
//     };

//     for (const [k, v] of Object.entries(firstRow)) {
//       result[k as keyof U] = v.toVariable();
//     }

//     for (let i = 1; i < n; i++) {
//       const row = mapfn(data.row(i));
//       for (const [k, v] of Object.entries(row)) result[k].push(v);
//     }

//     return result;
//   };
// }

// const f = ({ x, y }: { x: ScalarNumeric; y: ScalarNumeric }) => {
//   return { z: x.divideBy(y), w: x.add(y) };
// };

// const data1 = new Dataframe({ x, y });
// const wrangler1 = new Wrangler(data1);

// const z = wrangler1.compute(({ x, y }) => ({ z: x.add(y) }));
