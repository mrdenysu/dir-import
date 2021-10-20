# dirImport

> Only for NodeJS and ESModule

## Installation and using

> npm i https://github.com/mrdenysu/dir-import

```javascript
import dirImport from "dir-import";

const ctrl = await dirImport("/example", {
  deep: true, // default: true
  js: true, // default: true
  json: true // default: false
})

/**
 * ctrl = {
 *  anyData: { index: [Function: test], routerMiddleware: {}, test: [Function: log] },
 *  user: { name: 'David', age: 26 }
 * }
*/
```

Folders and files named in the format: 'word1-word2' will be recalled in the object by the name: 'word1Word2'
