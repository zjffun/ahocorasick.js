class ACTreeNode {
  constructor(val = "", parent = null, data = []) {
    this.val = val;
    this.parent = parent;
    this.data = data;
    this.childNodes = {};
    /* 
        There is a blue directed "suffix" arc from each node to the node 
        that is the longest possible strict suffix of it in the graph.
    */
    this.blueArc = null;
    /*
        There is a green "dictionary suffix" arc 
        from each node to the next node in the dictionary
        that can be reached by following blue arcs. 
    */
    this.greenArc = null;
  }
  print() {
    let tempNode = null,
      suffixLink = "",
      dictSuffixLink = "";

    console.log(
      JSON.stringify(
        this,
        (key, value) => {
          if (key === "parent") {
            return undefined;
          }
          if (key === "blueArc") {
            suffixLink = "";
            tempNode = value;
            while (tempNode) {
              suffixLink = tempNode.val + suffixLink;
              tempNode = tempNode.parent;
            }
            return `(${suffixLink})`;
          }
          if (key === "greenArc") {
            dictSuffixLink = "";
            tempNode = value;
            if (!tempNode) {
              return "";
            }
            while (tempNode) {
              dictSuffixLink = tempNode.val + suffixLink;
              tempNode = tempNode.parent;
            }
            return `(${dictSuffixLink})`;
          }
          return value;
        },
        2
      )
    );
  }
}

class AhoCorasick {
  constructor(objs) {
    const root = (this.root = new ACTreeNode());
    root.blueArc = root;

    let str = "",
      len = 0,
      tempNode = null,
      char = "";

    // tree
    objs.forEach(obj => {
      tempNode = root;

      if (Object.prototype.toString.call(obj) === "[object String]") {
        str = obj;
      } else {
        str = obj["str"] || obj[0] || "";
      }

      len = str.length;
      for (let i = 0; i < len; i++) {
        char = str[i];
        if (!tempNode.childNodes[char]) {
          tempNode.childNodes[char] = new ACTreeNode(char, tempNode);
        }
        tempNode = tempNode.childNodes[char];
      }

      tempNode.data.push(obj);
    });

    // blue arc and green arc
    let queue = [],
      queueHead = 0,
      tempChildNodes = [],
      tempBlueArcToNode = null,
      tempGreenArcToNode = null;

    queue = Object.entries(root.childNodes);
    while (queue.length > queueHead) {
      // Array.prototype.shift() is O(arr.length). Trere is using memory exchange efficiency.
      [char, tempNode] = queue[queueHead++];
      tempChildNodes = tempNode.childNodes;
      for (const key in tempChildNodes) {
        if (tempChildNodes.hasOwnProperty(key)) {
          queue.push([key, tempChildNodes[key]]);
        }
      }

      if (tempNode.parent === root) {
        tempNode.blueArc = root;
        continue;
      }

      // blue arc
      tempBlueArcToNode = tempNode.parent.blueArc;
      while (true) {
        if (tempBlueArcToNode.childNodes[char]) {
          tempNode.blueArc = tempBlueArcToNode.childNodes[char];
          break;
        }
        if (tempBlueArcToNode === root) {
          tempNode.blueArc = root;
          break;
        }
        tempBlueArcToNode = tempBlueArcToNode.blueArc;
      }

      // green arc
      tempGreenArcToNode = tempNode.blueArc;
      while (tempGreenArcToNode !== root) {
        if (tempGreenArcToNode.data.length) {
          tempNode.greenArc = tempGreenArcToNode;
          break;
        }
        tempGreenArcToNode = tempGreenArcToNode.blueArc;
      }
    }
  }

  search(str, func, initResult = 0) {
    const len = str.length;
    const root = this.root;
    let tempNode = root,
      tempChildNode = null,
      tempGreenArcToNode = null,
      char = "",
      result = initResult;

    for (let i = 0; i < len; i++) {
      char = str[i];
      while (true) {
        tempChildNode = tempNode.childNodes[char];
        if (tempChildNode) {
          tempNode = tempChildNode;

          // current node
          if (tempChildNode.data.length) {
            tempChildNode.data.forEach(d => {
              result = func(result, d);
            });
          }

          // green arc to node
          tempGreenArcToNode = tempChildNode.greenArc;
          while (tempGreenArcToNode) {
            if (tempGreenArcToNode.data.length) {
              tempGreenArcToNode.data.forEach(d => {
                result = func(result, d);
              });
            }
            tempGreenArcToNode = tempGreenArcToNode.greenArc;
          }

          break;
        }

        if (tempNode === root) {
          break;
        }

        tempNode = tempNode.blueArc;
      }
    }

    return result;
  }
}

exports.AhoCorasick = AhoCorasick;
