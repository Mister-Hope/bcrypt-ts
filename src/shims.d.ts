declare module "random" {
  export const random: (length: number) => number[] | Buffer;
}

declare module "nextTick" {
  export const nextTick: (callback: () => void) => unknown;
}
