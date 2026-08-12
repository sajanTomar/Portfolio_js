# JavaScript Masterclass Interview Preparation Guide (3+ YOE Level)

> **Target Audience:** Frontend Engineers (3+ YOE) looking to master JavaScript fundamentals from V8 engine execution internals to async event loop prioritization, `this` binding, prototypal inheritance, custom polyfills, and machine coding.

---

## Table of Contents
1. [Module 1: JS Engine, Execution Context & Hoisting](#module-1-js-engine-execution-context--hoisting)
2. [Module 2: Scoping, Lexical Environment & Closures](#module-2-scoping-lexical-environment--closures)
3. [Module 3: Async JS, Event Loop & Task Queues](#module-3-async-js-event-loop--task-queues)
4. [Module 4: Functions, `this` Binding & Functional Programming](#module-4-functions-this-binding--functional-programming)
5. [Module 5: Prototypes, Inheritance & ES6 Classes](#module-5-prototypes-inheritance--es6-classes)
6. [Module 6: ES6+ Deep Dive & Array Mechanics](#module-6-es6-deep-dive--array-mechanics)
7. [Module 7: DOM Events, Bubbling & Delegation](#module-7-dom-events-bubbling--delegation)
8. [Module 8: Performance Optimization: Debounce & Throttle](#module-8-performance-optimization-debounce--throttle)
9. [Module 9: Memory Management & Web Security](#module-9-memory-management--web-security)
10. [Module 10: Top 30+ Output Questions & Verbal Scripts](#module-10-top-30-output-questions--verbal-scripts)
11. [Module 11: Polyfills & Machine Coding Challenges](#module-11-polyfills--machine-coding-challenges)

---

## Module 1: JS Engine, Execution Context & Hoisting

### 1.1 Inside the JavaScript Engine (V8)
JavaScript is a **single-threaded, synchronous, interpreted (JIT-compiled) language**. The V8 engine (Chrome/Node.js) processes code in 4 stages:

```
Source Code ➔ Parser ➔ Abstract Syntax Tree (AST) ➔ Interpreter (Ignition) ➔ JIT Compiler (TurboFan) ➔ Machine Code
```

* **Memory Heap:** Unstructured memory pool allocating objects, arrays, and functions.
* **Call Stack:** LIFO (Last In, First Out) stack tracking function execution contexts.

---

### 1.2 Execution Context Architecture
Everything in JavaScript runs inside an **Execution Context**. It is created in two distinct phases:

#### Phase 1: Creation Phase (Memory Allocation)
1. Creates Global Object (`window` in browser, `global` in Node).
2. Sets up `this` binding.
3. Allocates memory for variables and functions:
   * `var` variables are assigned `undefined`.
   * `let` and `const` are allocated memory but remain **uninitialized** (Temporal Dead Zone).
   * Function declarations are stored in memory in their **entirety**.

#### Phase 2: Code Execution Phase
Executes code line-by-line, assigning values to variables and invoking functions.

```
+-------------------------------------------------------------+
|                     EXECUTION CONTEXT                       |
+------------------------------------+------------------------+
|   VARIABLE ENVIRONMENT (MEMORY)    |     THREAD OF EXEC     |
+------------------------------------+------------------------+
|  a: undefined                      |  var a = 10;           |
|  fnName: f() { ... }               |  fnName();             |
+------------------------------------+------------------------+
```

---

### 1.3 Hoisting & Temporal Dead Zone (TDZ)

* **Hoisting:** JavaScript's behavior of moving variable and function declarations to the top of their containing scope during the Creation Phase.
* **Function Declarations vs Expressions:**
  * Function declarations (`function foo(){}`) are **fully hoisted**.
  * Function expressions (`var foo = function(){}`) hoist the `var` variable as `undefined`, causing `TypeError: foo is not a function` if invoked before assignment!

#### What is Temporal Dead Zone (TDZ)?
TDZ is the time window between entering a scope and the variable's declaration initialization for `let` and `const`. Accessing a `let` or `const` variable inside its TDZ throws a `ReferenceError`.

```javascript
console.log(varNum); // Output: undefined (Hoisted)
console.log(letNum); // Uncaught ReferenceError: Cannot access 'letNum' before initialization (TDZ)

var varNum = 10;
let letNum = 20;
```

---

## Module 2: Scoping, Lexical Environment & Closures

### 2.1 Lexical Environment & Scope Chain
* **Lexical Environment:** Local memory + Reference to the Parent (Outer) Lexical Environment.
* **Scope Chain:** The hierarchy of parent lexical references checked when searching for a variable. If not found in local scope, JS checks outer scope recursively up to the Global Scope.

---

### 2.2 Closures Deep Dive (Senior Technical Focus)

#### What is a Closure?
A **Closure** is a function bundled together with references to its surrounding lexical environment. In simple terms: **A closure gives an inner function access to an outer function's scope even after the outer function has finished executing and returned.**

```javascript
function createCounter() {
  let count = 0; // Private state variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
// count variable cannot be modified directly from outside!
```

#### Real-World Practical Applications of Closures:
1. **Data Privacy / Encapsulation:** Creating private variables in modules.
2. **Currying & Partial Application:** `add(5)(10)`.
3. **Memoization:** Caching expensive function call results.
4. **Iterators & State Machines.**

---

## Module 3: Async JS, Event Loop & Task Queues

### 3.1 The Event Loop Architecture

JavaScript is single-threaded, but handles asynchronous operations via browser **Web APIs** and the **Event Loop**.

```
+------------------+         +--------------------+         +-----------------------+
|    CALL STACK    |         |     WEB APIs       |         |   MICROTASK QUEUE     |
| (Executes Code)  |         | (setTimeout, fetch)|         | (Promises, Mutation)  |
+--------+---------+         +---------+----------+         +-----------+-----------+
         |                             |                                |
         |                             v                                v
         |                   +------------------+             +-------------------+
         +-------------------|    EVENT LOOP    |<------------| MACROTASK QUEUE   |
                             +------------------+             | (setTimeout, DOM) |
                                                              +-------------------+
```

#### The Event Loop Rule of Priority:
1. Execute ALL synchronous code in the **Call Stack**.
2. When Call Stack becomes empty, check **Microtask Queue**. Execute ALL microtasks until the queue is completely drained.
3. Check **Macrotask Queue (Callback Queue)**. Move ONE macrotask to the Call Stack.
4. Repeat process.

| Queue Category | Triggers / APIS | Priority |
| :--- | :--- | :--- |
| **Microtask Queue** | `Promise.then()`, `catch()`, `finally()`, `queueMicrotask()`, `MutationObserver` | **HIGH (Drained completely first)** |
| **Macrotask Queue** | `setTimeout()`, `setInterval()`, `setImmediate()`, DOM event listeners, `requestAnimationFrame` | **LOW (Processed one task at a time)** |

---

### 3.2 Classic Event Loop Output Question
What will be logged to the console?

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");

// Output:
// 1
// 4
// 3 (Microtask Queue executes before Macrotask)
// 2 (Macrotask Queue)
```

---

## Module 4: Functions, `this` Binding & Functional Programming

### 4.1 The 5 Rules of `this` Binding

The value of `this` is determined **at call-time (how a function is invoked)**, except for Arrow Functions.

#### Rule 1: Default Binding (Standalone Invocation)
In non-strict mode, `this` points to `window` (browser) or `global` (Node). In `'use strict'`, `this` is `undefined`.

#### Rule 2: Implicit Binding (Object Method Invocation)
When a function is called as a method of an object (`obj.fn()`), `this` points to the object preceding the dot.

```javascript
const user = {
  name: "Priya",
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};
user.greet(); // "Hello, Priya"
```

#### Rule 3: Explicit Binding (`call`, `apply`, `bind`)
Directly controls `this` target:
* `fn.call(thisArg, arg1, arg2)`: Invokes function immediately with comma-separated arguments.
* `fn.apply(thisArg, [arg1, arg2])`: Invokes function immediately with array of arguments.
* `fn.bind(thisArg, arg1)`: **Returns a new function** bound to `thisArg` without immediate invocation.

#### Rule 4: `new` Keyword Binding
When invoking a function with `new Fn()`, JavaScript creates a new empty object, binds `this` to it, and returns it.

#### Rule 5: Arrow Functions (Lexical `this`)
Arrow functions **DO NOT have their own `this` binding**. They inherit `this` lexically from their enclosing parent scope! Calling `call()`, `apply()`, or `bind()` on an arrow function has **NO effect** on `this`.

---

## Module 5: Prototypes, Inheritance & ES6 Classes

### 5.1 Prototype Chain Mechanics
In JS, every object has an internal hidden property called `[[Prototype]]` (accessible via `Object.getPrototypeOf(obj)` or `__proto__`). If a property is not found on an object, JS searches up its prototype chain until it reaches `Object.prototype` (whose prototype is `null`).

```javascript
function Person(name) {
  this.name = name;
}

// Method attached to Prototype (Memory efficient - shared across all instances)
Person.prototype.sayHello = function() {
  console.log(`Hi, I am ${this.name}`);
};

const p1 = new Person("Sajan");
p1.sayHello(); // Searches p1 -> Person.prototype -> Object.prototype -> null
```

---

## Module 6: ES6+ Deep Dive & Array Mechanics

### 6.1 `map` vs `filter` vs `reduce`

* **`map(cb)`**: Transforms each element in array and returns a **NEW array** of identical length.
* **`filter(cb)`**: Tests each element with a predicate boolean function and returns a **NEW array** containing elements that passed `true`.
* **`reduce(cb, initialValue)`**: Accumulates array values into a single output value (number, object, or array).

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum using reduce
const sum = numbers.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);
console.log(sum); // 15
```

---

## Module 7: DOM Events, Bubbling & Delegation

### 7.1 Event Propagation Phases

```
DOM Tree Event Flow:
1. Capturing Phase (Trickling down from Window -> Target)
2. Target Phase (Element clicked)
3. Bubbling Phase (Bubbling up from Target -> Window)
```

```javascript
// Adding listener in Capturing Phase (3rd argument = true)
element.addEventListener('click', handler, true);

// Adding listener in Bubbling Phase (Default 3rd argument = false)
element.addEventListener('click', handler, false);
```

#### Event Control Methods:
* `event.preventDefault()`: Prevents browser default behavior (e.g., stopping form submit link navigation).
* `event.stopPropagation()`: Prevents event from bubbling up or trickling down further.
* `event.stopImmediatePropagation()`: Prevents bubbling AND stops other listeners on the SAME element from executing.

---

### 7.2 Event Delegation (Interview Essential)
Instead of attaching 1,000 event listeners to individual `<li>` items, attach **a single event listener to the parent container** and catch events as they bubble up!

```html
<ul id="parent-list">
  <li data-id="1">Item 1</li>
  <li data-id="2">Item 2</li>
  <li data-id="3">Item 3</li>
</ul>

<script>
  document.getElementById('parent-list').addEventListener('click', (event) => {
    // Check if clicked element is an LI
    if (event.target && event.target.nodeName === 'LI') {
      console.log(`Clicked Item ID: ${event.target.dataset.id}`);
    }
  });
</script>
```

---

## Module 8: Performance Optimization: Debounce & Throttle

### 8.1 Debounce vs Throttle

| Technique | Description | Ideal Use Case |
| :--- | :--- | :--- |
| **Debouncing** | Delays execution until a specified delay time has passed **since the LAST event call**. Resets timer on every new call. | Search input autocomplete, window resize handlers |
| **Throttling** | Guarantees execution **at most once per fixed time interval**, regardless of how many events fire. | Scroll position tracking, button spam prevention |

#### Custom `debounce` Implementation:
```javascript
function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    const context = this;
    clearTimeout(timerId); // Reset timer on new trigger
    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
```

#### Custom `throttle` Implementation:
```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
```

---

## Module 9: Memory Management & Web Security

### 9.1 Garbage Collection & Common Memory Leaks
JavaScript uses **Mark-and-Sweep Garbage Collection**. Objects unreachable from the Root are collected.

#### Top Causes of Memory Leaks:
1. **Accidental Global Variables:** Assigning variables without `var`/`let`/`const` (`name = "test"` binds to `window`).
2. **Uncleared `setInterval` or `setTimeout`:** Callbacks holding variables in closure scope forever.
3. **Detached DOM Elements:** Keeping JS reference to a DOM node removed from tree.
4. **Unremoved Event Listeners:** Event listeners on global objects (`window.addEventListener('resize')`).

---

### 9.2 Security: XSS, CSRF, and CORS

* **XSS (Cross-Site Scripting):** Attacker injects malicious JS into your page.
  * *Mitigation:* Never use `innerHTML` with unsanitized user inputs; use `textContent`. Implement strict `Content-Security-Policy` (CSP) headers.
* **CSRF (Cross-Site Request Forgery):** Attacker tricks user's browser into making authenticated requests to target site using stored cookies.
  * *Mitigation:* Use `SameSite=Strict` or `SameSite=Lax` cookie flags and CSRF anti-forgery tokens.
* **CORS (Cross-Origin Resource Sharing):** Browser security mechanism preventing cross-origin HTTP requests unless server responds with appropriate `Access-Control-Allow-Origin` headers.

---

## Module 10: Top 30+ Output Questions & Verbal Scripts

### Q1: What is the output of `var` in a `for` loop with `setTimeout` vs `let`?
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Output: 3, 3, 3 (var is function-scoped; closures share same 'i' reference)

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 1000);
}
// Output: 0, 1, 2 (let is block-scoped; creates new lexical binding each iteration)
```

### Q2: What is the output of `typeof null` and `typeof undefined`?
> **Verbal Answer:**
> "`typeof null` returns `'object'`. This is a famous legacy bug in JavaScript dating back to JS 1.0 where object type tags were represented as `000` in binary, matching null's pointer representation. `typeof undefined` correctly returns `'undefined'`."

### Q3: What is the difference between `==` and `===`?
> **Verbal Answer:**
> "`==` performs abstract equality comparison with implicit type coercion (converting operands to a common type before comparing). `===` performs strict equality comparison checking both value and data type without coercion."

### Q4: Explain `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`.
> **Verbal Answer:**
> * `Promise.all`: Resolves when ALL promises fulfill; rejects immediately if ANY single promise rejects.
> * `Promise.allSettled`: Waits for ALL promises to complete (fulfilled or rejected) and returns an array of status objects.
> * `Promise.race`: Resolves or rejects as soon as the FIRST promise settles.
> * `Promise.any`: Resolves as soon as the FIRST promise fulfills; rejects only if ALL promises reject.

---

## Module 11: Polyfills & Machine Coding Challenges

### Challenge 1: Polyfill for `Array.prototype.myReduce`

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== 'function') {
    throw new TypeError(`${callback} is not a function`);
  }

  const array = this;
  let accumulator = initialValue !== undefined ? initialValue : array[0];
  let startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < array.length; i++) {
    if (i in array) { // Handles sparse arrays
      accumulator = callback(accumulator, array[i], i, array);
    }
  }

  return accumulator;
};

// Test
const nums = [10, 20, 30];
console.log(nums.myReduce((acc, val) => acc + val, 0)); // 60
```

---

### Challenge 2: Polyfill for `Promise.all`

```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an Array'));
    }

    const results = [];
    let completedCount = 0;

    if (promises.length === 0) {
      return resolve(results);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value; // Preserve original array index order
          completedCount++;
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error); // Reject immediately on first failure
        });
    });
  });
};
```

---

### Challenge 3: Machine Coding - Custom Event Emitter (PubSub System)

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }

  // Emit/Publish an event
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        callback.apply(this, args);
      });
    }
  }
}

// Test Usage:
const emitter = new EventEmitter();
const unsubscribe = emitter.on('userLogin', (user) => console.log(`Welcome ${user}`));
emitter.emit('userLogin', 'Sajan'); // Output: Welcome Sajan
unsubscribe(); // Unsubscribe handler
```

---

## Next Steps in Your Complete Web Development Interview Roadmap

You now have a complete, three-pillar interview prep library in your workspace:
1. **[HTML_Interview_Masterclass.md](file:///Users/sajan1997/Desktop/Portfolio_js/HTML_Interview_Masterclass.md)**
2. **[CSS_Interview_Masterclass.md](file:///Users/sajan1997/Desktop/Portfolio_js/CSS_Interview_Masterclass.md)**
3. **[JS_Interview_Masterclass.md](file:///Users/sajan1997/Desktop/Portfolio_js/JS_Interview_Masterclass.md)**

Review the concepts and verbal scripts out loud. If you want to practice mock interview questions on any of these modules, let me know!
