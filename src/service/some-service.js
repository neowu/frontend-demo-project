export const sayHello = name => `Hello ${name}!`;

export const sayBye = name => `Bye ${name}!`;   // used to test tree shaking

export const sayHelloPromise = name => Promise.resolve(42);
