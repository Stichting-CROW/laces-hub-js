# laces-hub-js

Package to connect programmatically with [Laces Hub](http://hub.laces.tech).

## Usage

```ts
const mygroup = await Laces.Group("/dir/subdir");
const info = mygroup.getInfo();
const myrepo = await Laces.Repository("/dir/subdir/repo");
myrepo.uploadFile(
  {
    name: "My File",
    versionLabel: "v1",
    versioningMode: "NONE",
  },
  Buffer.from("Hello, world!")
);

const pub = await Laces.Publication("/dir/subdir/repo/publication");
pub.sparqlSelect("select * where { ?s ?p ?o } limit 10");
```
