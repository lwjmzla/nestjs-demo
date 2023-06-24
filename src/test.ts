import 'reflect-metadata';

interface User {
  name: string;
  age: number;
}
class SomeClass {
  test(para: User): string; // 函数类型定义1
  test(para: number, str: string): number; // 函数类型定义2
  // eslint-disable-next-line class-methods-use-this
  test(para: any, str?: any): any {
    if (typeof para === 'number') {
      // !一般函数重载和类型守卫一起用。
      return para;
    } else {
      return para.name as string;
    }
  }
}

const some = new SomeClass();
const a = some.test({ name: 'lwj', age: 18 });
const b = some.test(1, 'true');

function Inject(target: any, key: string) {
  target[key] = new (Reflect.getMetadata('design:type', target, key))();
}

class A {
  sayHello() {
    console.log('hello');
  }
}

class B {
  @Inject // !编译后等同于执行了@Reflect.metadata( "design: type",A)
  a!: A;

  say() {
    this.a.sayHello();
  }
}

new B().say();


function groupBy(arr, id) {
  const map = new Map();
  for (const item of arr) {
    const key = item[id];
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }
  return Array.from(map.values());
}

const arr = [ { id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 1, name: 'Charlie' }, { id: 3, name: 'David' }, { id: 2, name: 'Eve' }, ]; 
const result = groupBy(arr, 'id'); 
console.log(result); // [ // [{ id: 1, name: 'Alice' }, { id: 1, name: 'Charlie' }], // [{ id: 2, name: 'Bob' }, { id: 2, name: 'Eve' }], // [{ id: 3, name: 'David' }] // ]

const obj = arr.reduce((res, item) => {
  res[item.id] ? res[item.id].push(item) : res[item.id] = [item]
  return res
}, {})
console.log(obj)

const arr1 = Object.values(obj)
console.log(arr1)