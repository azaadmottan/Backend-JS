# CommonJS (CJS):

## CommonJS is a module system for JavaScript that was designed for server-side environments, particularly in the context of the Node.js runtime.

In CommonJS, modules are loaded synchronously. Each module has its own scope, and the dependencies are loaded using the require function.

Example:

```Javascript
    // Module definition (module.js)
    const myModule = require('./myModule');

    // Exporting from module (myModule.js)
    module.exports = {
        myFunction: function() {
        // ...
        }
    };
```

# ECMAScript Modules (ESM):

## ECMAScript Modules is a standard for structuring and organizing code using modules in JavaScript. It is native to the language and is supported in modern browsers and environments like Node.js.

ESM uses import and export statements to define and import modules. Unlike CommonJS, ESM supports asynchronous module loading.

Example:

```Javascript
    // Module definition (module.mjs)
    import { myFunction } from './myModule';

    // Exporting from module (myModule.mjs)
    export function myFunction() {
        // ...
    }
```

It's worth noting that the file extension for ECMAScript Modules is often .mjs to distinguish them from CommonJS modules (.js). 

However, in recent versions of Node.js, ESM is supported in files with the .js extension as well. The choice between CommonJS and ECMAScript Modules depends on the environment and specific project requirements.
