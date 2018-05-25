import {tick} from "framework/module";
import {TickListener} from "framework/listener";
import {call, fork} from "redux-saga/effects";
import {run} from "framework/handler";
import {delay} from "redux-saga";

test("tick with one listener run every 3 secs", () => {
    const listener = {interval: 3} as TickListener;
    let generator = tick([listener], 0);
    expect(generator.next().value).toEqual(fork(run, listener));
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(fork(run, listener));
    expect(generator.next().value).toEqual(call(delay, 1000));

    generator = tick([listener], 101);
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(fork(run, listener));
    expect(generator.next().value).toEqual(call(delay, 1000));
});

test("tick with 2 listeners", () => {
    const listener1 = {interval: 3} as TickListener;
    const listener2 = {interval: 5} as TickListener;
    let generator = tick([listener1, listener2], 100);
    expect(generator.next().value).toEqual(fork(run, listener2));
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(call(delay, 1000));
    expect(generator.next().value).toEqual(fork(run, listener1));

    generator = tick([listener1, listener2], 15);
    expect(generator.next().value).toEqual(fork(run, listener1));
    expect(generator.next().value).toEqual(fork(run, listener2));
    expect(generator.next().value).toEqual(call(delay, 1000));
});
