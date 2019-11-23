# ahocorasick.js

Just a JS implementation of Aho–Corasick algorithm.

# Usage



# Examples

determining-dna-health:

```js
// a b c aa d b
// 1 2 3 4 5 6
let genes = ["a", "b", "c", "aa", "d", "b"];
let healths = [1, 2, 3, 4, 5, 6];
let ac = new AhoCorasick(
  genes.map((gene, i) => ({
    str: gene,
    health: health[i]
  }))
);

// 1 5 caaab
// 0 4 xyz
// 2 4 bcdybc
let strands = [
  {
    str: "caaab",
    start: 1,
    end: 5
  },
  {
    str: "xyz",
    start: 0,
    end: 4
  },
  {
    str: "badybc",
    start: 2,
    end: 4
  }
];
let result = 0;
strands.forEach(strand => {
  result = ac.search(
    str,
    function(start, end, res, d) {
      if (d.key >= start && d.key <= end) {
        return res + d.health;
      }
      return res;
    }.bind(null, strand.start, strand.end),
    null,
    0
  );
  console.log(result);
});
```
