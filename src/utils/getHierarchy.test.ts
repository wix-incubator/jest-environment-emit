import { getHierarchy } from './getHierarchy';

describe('getHierarchy', () => {
  let map: Map<any, string[]>;

  beforeEach(() => {
    map = new Map();
  });

  class A {
    static push(value: string) {
      const arr = map.get(this) ?? [];
      arr.push(value);
      map.set(this, arr);
    }

    foo() {}
  }

  class B extends A {}
  class C extends B {}

  it('should return the hierarchy of a class', () => {
    const a = new A();
    const b = new B();
    const c = new C();
    const anyProto = Object.getPrototypeOf(class {});

    A.push('A');
    B.push('B');
    C.push('C');

    expect(map.get(A)).toEqual(['A']);
    expect(map.get(B)).toEqual(['B']);
    expect(map.get(C)).toEqual(['C']);

    expect(getHierarchy(a)).toEqual([anyProto, A]);
    expect(getHierarchy(b)).toEqual([anyProto, A, B]);
    expect(getHierarchy(c)).toEqual([anyProto, A, B, C]);
  });
});
