import { Tree } from './trees.js';

// Function to print tree taken from project outline
const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

window.Tree = Tree;
window.prettyPrint = prettyPrint;

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
console.log(`Input Array Values: ${arr}`);
const tree = new Tree(arr);
prettyPrint(tree.root);

let levelOrderArray = [];
let preOrderArray = [];
let inOrderArray = [];
let postOrderArray = [];

tree.levelOrder((data) => levelOrderArray.push(data));
tree.preOrder((data) => preOrderArray.push(data));
tree.inOrder((data) => inOrderArray.push(data));
tree.postOrder((data) => postOrderArray.push(data));

console.log(`Level-Order Traversal: ${levelOrderArray.join(', ')}`);
console.log(`Pre-Order Traversal: ${preOrderArray.join(', ')}`);
console.log(`In-Order Traversal: ${inOrderArray.join(', ')}`);
console.log(`Post-Order Traversal: ${postOrderArray.join(', ')}`);

console.log(`Height of node 67: ${tree.height(tree.find(67))}`);
console.log(`Depth of node 67: ${tree.depth(tree.find(67))}`);
console.log(`Height of node 8: ${tree.height(tree.find(8))}`);
console.log(`Depth of node 8: ${tree.depth(tree.find(8))}`);

// generate array of 50 random numbers between 0 and 1000
// Math.random is [inclusive, exclusive) so multiply by 1001 and take the floor to include 1000 in the range
let randomInts = new Array(50)
  .fill(0)
  .map(() => Math.floor(Math.random(0, 1000) * 1001));

randomInts.forEach((element) => tree.insert(element));

console.log(
  `Inserted 50 new nodes with random positive integer values into the tree: ${randomInts}`
);

console.log(`Is the tree still balanced? ${tree.isBalanced}`);

tree.rebalance;
console.log(
  `Executed 'tree.rebalance' to rebalance the tree.\nIs the tree balanced: ${tree.isBalanced}`
);
