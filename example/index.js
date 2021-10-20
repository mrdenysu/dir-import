import dirImport from "../dist/index.js";

const Any = await dirImport("example/any", {
    deep: true,
    js: true,
    json: true,
})

console.dir(Any);
//   {
//     anyData: { index: [Function: test], test: [Function: log] },
//     user: { name: 'David', age: 26 }
//   }
