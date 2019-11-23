"use strict";
const AhoCorasick = require("../src/index.js").AhoCorasick;

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", inputStdin => {
  inputString += inputStdin;
});

process.stdin.on("end", _ => {
  inputString = inputString
    .replace(/\s*$/, "")
    .split("\n")
    .map(str => str.replace(/\s*$/, ""));

  main();
});

function readLine() {
  return inputString[currentLine++];
}

function determineDNAHealth(genes, health, strands) {
  let genesWithHealth = genes.map((gene, i) => {
    return { str: gene, health: health[i], key: i };
  });
  let max = 0,
    min = Number.POSITIVE_INFINITY;
  let ac = new AhoCorasick(genesWithHealth);
  //   ac.root.print();
  for (let i = 0; i < strands.length; i++) {
    let strand = strands[i];
    let currentHealth = ac.search(
      strand.d,
      function(first, last, res, d) {
        if (d.key >= first && d.key <= last) {
          return res + d.health;
        }
        return res;
      }.bind(null, strand.first, strand.last)
    );
    max = Math.max(currentHealth, max);
    min = Math.min(currentHealth, min);
  }
  return `${min} ${max}`;
}

function main() {
  const n = parseInt(readLine(), 10);

  const genes = readLine().split(" ");

  const health = readLine()
    .split(" ")
    .map(healthTemp => parseInt(healthTemp, 10));

  const s = parseInt(readLine(), 10);

  let strands = [];
  for (let sItr = 0; sItr < s; sItr++) {
    const firstLastd = readLine().split(" ");

    const first = parseInt(firstLastd[0], 10);

    const last = parseInt(firstLastd[1], 10);

    const d = firstLastd[2];
    strands.push({ first, last, d });
  }

  console.log(determineDNAHealth(genes, health, strands));
}
