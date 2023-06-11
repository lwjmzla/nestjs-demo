interface User {
    name: string;
    age: number;
}
declare class SomeClass {
    test(para: User): string;
    test(para: number, str: string): number;
}
declare const some: SomeClass;
declare const a: string;
declare const b: number;
