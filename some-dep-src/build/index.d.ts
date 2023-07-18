/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from "node:events";
interface MyInterface {
    a: number;
    e?: EventEmitter;
}
export declare const bar: (a: number) => MyInterface;
export declare const foo: (a: MyInterface) => number;
export declare const render: () => void;
export {};
//# sourceMappingURL=index.d.ts.map