export const getIllegalArgumentsTypeError = (...args: unknown[]): Error =>
  new Error(`Illegal arguments: ${args.map((arg) => typeof arg).join(", ")}`);
