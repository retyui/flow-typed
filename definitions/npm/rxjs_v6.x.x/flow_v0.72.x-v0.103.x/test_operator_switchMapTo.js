//@flow

import { it } from "flow-typed-test";
import { of } from "rxjs";
import { switchMapTo } from "rxjs/operators";

it("should infer correctly", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo")));
});

it("should infer correctly with multiple types", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo", 4)));
});

it("should infer correctly with an array", () => {
  const o = of(1, 2, 3).pipe(switchMapTo([4, 5, 6]));
});

it("should infer correctly with a Promise", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(new Promise<string>(() => {})));
});

it("should infer correctly by using the resultSelector first parameter", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo"), a => a));
});

it("should infer correctly by using the resultSelector second parameter", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo"), (a, b) => b));
});

it("should support a resultSelector that takes an inner index", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo"), (a, b, innnerIndex) => a));
});

it("should support a resultSelector that takes an inner and outer index", () => {
  const o = of(1, 2, 3).pipe(
    switchMapTo(of("foo"), (a, b, innnerIndex, outerIndex) => a)
  );
});

it("should support an undefined resultSelector", () => {
  const o = of(1, 2, 3).pipe(switchMapTo(of("foo"), undefined));
});

it("should enforce types", () => {
  // $ExpectError
  const o = of(1, 2, 3).pipe(switchMapTo());
});

it("should enforce the return type", () => {
  // $ExpectError
  const o = of(1, 2, 3).pipe(switchMapTo(p => p));
  // $ExpectError
  const p = of(1, 2, 3).pipe(switchMapTo(4));
});
