export const emptyPOJO = () => ({});
export const firstArgument = <T>(x: T, y: any) => x;
export const secondArgument = <T>(x: any, y: T) => y;

export const toInt = (x: string) => parseInt(x, 10);

export const sortStrings = (x: string[]) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  x.sort(collator.compare);
};

export const minMax = (x: number[]) => {
  return x.reduce(
    ([min, max], e) => [Math.min(min, e), Math.max(max, e)],
    [Infinity, -Infinity]
  );
};
