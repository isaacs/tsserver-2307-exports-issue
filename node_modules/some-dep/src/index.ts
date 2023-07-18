import { EventEmitter } from "node:events";
interface MyInterface {
  a: number;
  e?: EventEmitter;
}

export const bar = (a: number): MyInterface => ({ a });
export const foo = (a: MyInterface) => a.a;

export const render = () => {};
