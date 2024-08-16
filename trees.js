import { mergeSort } from './merge-sort.js';
import { Queue } from './queue.js';

class Node {
  constructor(data = null) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array = []) {
    this.root = this.#buildTree(array);
  }

  #buildTree(array) {
    if (!Array.isArray(array)) {
      throw new Error('Tree requires an array to be the input');
    }

    // return null for no values - want to avoid including a null node as it could be misleading
    if (array.length === 0) {
      return null;
    }

    // terminate early if array has a single element - just to avoid needless additional recurisve calls
    if (array.length === 1) {
      return new Node(array[0]);
    }

    // sort array and remove duplicates - array -> set removed dupes -> array -> mergeSort to sort
    let sortedArray = mergeSort(Array.from(new Set(array)));

    let mid = Math.floor(sortedArray.length / 2);
    let [left, right] = [sortedArray.slice(0, mid), sortedArray.slice(mid + 1)];

    const root = new Node(sortedArray[mid]);
    root.left = this.#buildTree(left);
    root.right = this.#buildTree(right);
    return root;
  }

  find(value = null) {
    if (value === null) {
      return;
    }

    if (this.root === null) {
      return 'Tree is empty';
    }

    return this.#findNode(this.root, value);
  }

  #findNode(currentNode, value) {
    if (currentNode === null) {
      return 'Value not found in tree';
    }

    if (value < currentNode.data) {
      return this.#findNode(currentNode.left, value);
    } else if (value > currentNode.data) {
      return this.#findNode(currentNode.right, value);
    } else {
      return currentNode;
    }
  }

  get min() {
    return this.#findMinNode(this.root);
  }

  #findMinNode(node) {
    if (node.left === null) {
      return node;
    } else {
      return this.#findMinNode(node.left);
    }
  }

  get max() {
    return this.#findMaxNode(this.root);
  }

  #findMaxNode(node) {
    if (node.right === null) {
      return node;
    } else {
      return this.#findMaxNode(node.right);
    }
  }

  insert(data = null) {
    if (data === null) {
      return;
    }

    const newNode = new Node(data);

    if (this.root === null) {
      this.root = newNode;
      return;
    } else {
      this.#insertNode(this.root, newNode);
    }
  }

  // Helper method for inserting a node
  #insertNode(currentNode, newNode) {
    // don't insert duplicate values
    if (newNode.data === currentNode.data) {
      return;
    } else if (newNode.data < currentNode.data) {
      if (currentNode.left === null) {
        currentNode.left = newNode;
      } else {
        this.#insertNode(currentNode.left, newNode);
      }
    } else {
      if (currentNode.right === null) {
        currentNode.right = newNode;
      } else {
        this.#insertNode(currentNode.right, newNode);
      }
    }
  }

  remove(value = null) {
    if (value === null) {
      return;
    }

    if (this.root === null) {
      return 'Tree is empty';
    }

    this.root = this.#removeNode(this.root, value);
  }

  // Helper method to remove nodes
  #removeNode(currentNode, value) {
    if (currentNode === null) {
      return null;
    }

    // traverse the tree until the node is found
    if (value < currentNode.data) {
      currentNode.left = this.#removeNode(currentNode.left, value);
    } else if (value > currentNode.data) {
      currentNode.right = this.#removeNode(currentNode.right, value);
    } else {
      // The value has been found in the tree - handle how to remove

      // Case 1: The node has 0 or 1 children
      if (currentNode.left === null) {
        return currentNode.right;
      } else if (currentNode.right === null) {
        return currentNode.left;
      }

      // Case 2: The node has 2 children - need to find in-order successor to replace node
      const minNode = this.#findMinNode(currentNode.right);
      currentNode.data = minNode.data;
      currentNode.right = this.#removeNode(currentNode.right, minNode.data);
    }
    return currentNode;
  }

  levelOrder(callback, queueLength = 16) {
    if (typeof callback !== 'function') {
      throw new Error(
        'levelOrder requires a callback function as an input parameter'
      );
    }

    if (this.root === null) {
      return 'Tree is empty';
    }

    const queue = new Queue(queueLength);
    queue.enqueue(this.root);

    while (queue.length > 0) {
      let currentNode = queue.dequeue();
      callback(currentNode.data);

      if (currentNode.left !== null) {
        queue.enqueue(currentNode.left);
      }

      if (currentNode.right !== null) {
        queue.enqueue(currentNode.right);
      }
    }
  }

  preOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error(
        'preOrder requires a callback function as an input parameter'
      );
    }

    if (this.root === null) {
      return 'Tree is empty';
    }
    return this.#preOrderTraversal(this.root, callback);
  }

  #preOrderTraversal(node, callback) {
    if (node !== null) {
      callback(node.data);
      this.#preOrderTraversal(node.left, callback);
      this.#preOrderTraversal(node.right, callback);
    }
  }

  inOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error('A callback function must be passed to inOrder');
    }

    if (this.root === null) {
      return 'Tree is empty';
    }
    return this.#inOrderTraversal(this.root, callback);
  }

  #inOrderTraversal(node, callback) {
    if (node !== null) {
      this.#inOrderTraversal(node.left, callback);
      callback(node.data);
      this.#inOrderTraversal(node.right, callback);
    }
  }

  postOrder(callback) {
    if (typeof callback !== 'function') {
      throw new Error(
        'postOrder requires a callback function as an input parameter'
      );
    }

    if (this.root === null) {
      return 'Tree is empty';
    }
    return this.#postOrderTraversal(this.root, callback);
  }

  #postOrderTraversal(node, callback) {
    if (node !== null) {
      this.#postOrderTraversal(node.left, callback);
      this.#postOrderTraversal(node.right, callback);
      callback(node.data);
    }
  }

  height(node) {
    if (this.root === null) {
      return 'Tree is empty';
    }

    // return -1 for null node because the recursion will still trigger when node.left/right = null
    if (node === null) {
      return -1;
    }

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  depth(node) {
    if (this.root === null) {
      return 'Tree is empty';
    }

    return this.#depthOfNode(this.root, node, 0);
  }

  // helper function for depth calculation
  #depthOfNode(currentNode, targetNode, depth) {
    // If node is not found
    if (currentNode === null) {
      return -1;
    }

    if (currentNode === targetNode) {
      return depth;
    }

    // Search left subtree
    let leftTreeSearch = this.#depthOfNode(
      currentNode.left,
      targetNode,
      depth + 1
    );
    if (leftTreeSearch !== -1) {
      return leftTreeSearch;
    }

    // Search right subtree
    return this.#depthOfNode(currentNode.right, targetNode, depth + 1);
  }

  get isBalanced() {
    return this.#checkBalance(this.root).balanced;
  }

  // helper function for balance evaluation
  #checkBalance(node) {
    // base case for leaf nodes
    if (node === null) {
      return { height: -1, balanced: true };
    }

    // Use recursion to check left subtree
    // check if the subtree is balanced, if not it immediately returns up the recursive stack
    let leftOutcome = this.#checkBalance(node.left);
    if (!leftOutcome.balanced) {
      return { height: 0, balanced: false };
    }

    // Use recursion to check right subtree
    let rightOutcome = this.#checkBalance(node.right);
    if (!rightOutcome.balanced) {
      return { height: 0, balanced: false };
    }

    // Calculate the height difference
    let heightDiff = Math.abs(leftOutcome.height - rightOutcome.height);

    // Determine the balance of the current node
    let isCurrentNodeBalanced = heightDiff <= 1;

    // Calculate the height of the current node
    let currentNodeHeight =
      Math.max(leftOutcome.height, rightOutcome.height) + 1;

    return {
      height: currentNodeHeight,
      balanced: isCurrentNodeBalanced,
    };
  }

  get rebalance() {
    if (this.root === null) {
      return 'Tree is empty, nothing to rebalance';
    }
    // inOrderArray can't contain duplicate values because of how the insert method is set up
    let inOrderArray = [];
    this.inOrder((data) => inOrderArray.push(data));

    // This will still de-dupe and sort the array, even though it's already sorted - just as a precaution
    this.root = this.#buildTree(inOrderArray);
  }
}

export { Tree };
