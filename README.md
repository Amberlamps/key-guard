# key-guard

## What is this about?

Orignally this module was created to keep track of keys in redis. But you can use it for any other applications of course.
Redis is an awesome key/value store, but you can easily lose track of all keys used in production, because there is no schema that every developer of your team has to follow.

## Install
 

    npm install key-guard --save

## How to use?

    const coreKey = require("key-guard")(options);

`options`is an object with following attributes:

 - `namespace` - _string_ - A string that is prefixed to every generated key.
 - `minLength`- _number_ - Min length of generated key (default: `1`).
 - `maxLength`- _number_ - Max length of generated key (default: `100`).
 - `fragments`- _object_ - A fragment is a string that is part of the key and separated by `fragments.delimiter`.
 - `fragments.delimiter`- _string_ - Delimiter between every key fragement (default: `:`).
 - `fragments.regexp`- _regexp_ - Regular expression that every key fragment is checked against (default: `/^[a-zA-Z0-9]+$/`).
 - `fragments.count.min`- _number_ - Min number of fragments (default: `2`).
 - `fragments.count.max`- _number_ - Max number of fragments (default: `5`).
 - `fragments.len.min`- _number_ - Min length of fragment string (default: `2`).
 - `fragments.len.max`- _number_ - Max length of fragment string (default: `20`).

```
{
  namespace: 'myApp',
  minLength: 1,
  maxLength: 100,
  fragments: {
    delimiter: ':',
    count: {
      min: 2,
      max: 5
    },
    len: {
      min: 2,
      max: 20
    },
    regexp: /^[a-zA-Z0-9]+$/
  }
}
```

## Example

    const keyGuard = require("key-guard");
    let coreKey = keyGuard({
      namespace: "myApp"
    });
    let key = coreKey().update("users").update("283").get();
    console.log(key);
    // => "myApp:users:283"

You can also overwrite the namespace or entire prefixes:

    let key = coreKey("newNamespace:records").update("2384").get();
    console.log(key);
    // => "newNamespace:records:2384"

## Pro tip #1
Create one file that creates the core key and the is included in every other page that needs generated keys:

**coreKey.js**

    const keyGuard = require("key-guard");
    module.exports = keyGuard({
      namespace: "myApp"
    });

**index.js**

    const coreKey = require("./coreKey.js");
    let key = coreKey().update("users").update("283").get();
    console.log(key);
    // => "myApp:users:283"

## Pro tip #2
Usually scripts use keys for different fragments/sections multiple times. Declare a base key on top of each script or within `coreKey.js`.

**coreKey.js**

    const keyGuard = require("key-guard");
    module.exports = keyGuard({
      namespace: "myApp"
    });
    
**users.js**

    const coreKey = require("./coreKey.js");
    const usersKey = coreKey().update("users");
    
    console.log(usersKey.update("283").get());
    console.log(usersKey.update("284").get());
    console.log(usersKey.update("285").get());
    // => "myApp:users:283"
    // => "myApp:users:284"
    // => "myApp:users:285"

## Pro tip #3
If you do not want to have any literals within you scripts, load variables from config files or environment variables.

**coreKey.js**

    const keyGuard = require("key-guard");
    module.exports = keyGuard({
      namespace: process.env.REDIS_NAMESPACE_KEY
    });


 `> REDIS_NAMESPACE_KEY=myApp node index.js`
