# Balanced Binary Search Trees - An Intermediate JavaScript Project

## Introduction

This is a mini project forming part of the [JavaScript course](https://www.theodinproject.com/lessons/javascript-binary-search-trees) hosted by [The Odin Project](https://www.theodinproject.com/) and provides an opportunity for students to practice implementing their own binary search tree class object in JavaScript.

## Scope

The goal of this project is to implement the following:

- [x] A `Node` class or factory function.
  - [x] It should have an attribute to store data, as well as its left and right children.
- [x] A `Tree` class or factory that accepts an array as input when initialised.
  - The tree should have a `root` attribute to store the root node of a tree.
- The `Tree` class should contain the following methods:
  - [x] `buildTree(array)` function that takes an array of data and returns a _balanced binary tree_ full of `Node` objects.
    - [x] This should remove duplicates and sort the input array.
    - [x] This function should return the level-0 node (root) of the tree.
  - [x] `insert(value)` to insert a given value into the tree.
  - [x] `deleteItem(value)` to delete a given value from the tree.
    - [x] Function should handle when a node is a leaf or has a single child.
    - [x] It should also handle a node with 2 children.
  - [x] `find(value)` that returns a node with the given value (if it exists in the tree).
  - [x] `levelOrder(callback)` function to perform _breadth-first_ traversal of the tree.
    - [x] Function should accept a callback as the input. If no callback is provided, it should throw an error.
    - [ ] Use an `array` to act as a _queue_ object to track all of the child nodes not yet traversed. (See [Arrays vs Queues](#level-order-traversal---arrays-vs-queues) in the [Notes on My Implementation](#notes-on-my-implementation) section to see why an array wasn't used)
  - Add the following functions to perform _depth-first_ traversal. Each function should accept a callback as an input:
    - [x] `inOrder(callback)`
    - [x] `preOrder(callback)`
    - [x] `postOrder(callback)`
    - [x] Each function throws an error if input provided is not a function
  - [x] `height(node)` to return the height of a given node, where height is the number of edges in the longest path from a given node to a leaf node.
  - [x] `depth(node)` to return the depth of a given node, where depth is the number of edges in the longest path from the root node to the given node.
  - [x] `isBalanced` to check whether the tree is balanced.
    - A tree is balanced if the difference between heights of the left subtree and right subtree of _every_ node is not more than 1.
  - [x] `rebalance` that rebalances an unbalanced tree.

## Notes on My Implementation

### De-duping Input Arrays

Whether or not a binary search tree should allow for duplicate values depends on the specific use case and requirements.

This project advises that duplicates should be removed when the tree is being constructed and my implementation has adhered to this.  
To do this, I've leveraged JavaScripts built in `Set()` constructor as it enforces uniqueness amongst its elements. So removing duplicates is simply a case of

Take input array => Convert it to a new Set => Convert the Set to new Array

Having said that, there might be times where it's desirable to retain duplicate values within a tree. Based on my current implementation, I think the easiest ways to allow for duplicate values would be to:

1. Add a new counter variable to the `Node` class.
   - If the node has no data, then the counter is null.
   - When data is provided to the node, increment the count by 1.
   - For every duplicate data encountered, further increment by 1.
2. Make the data attribute of the node store a linked list.
   - The data attribute should initially be null.
   - When data is provided to a node, store the data in a linked list, then store the linked list in the nodes data variable.
   - When duplicate data is encountered, make it the next item in the linked list.

Both of these options should be relatively straightforward to add to the current implementation without needing to make any major overhauls to any of the methods.  
Such overhauls would likely be required if, for example, you allowed duplicate values to take up their own nodes in either the left or right subtrees (primarily as this would add complexity to `search`, `delete`, and `rebalance`).

### Level Order Traversal - Arrays vs Queues

In the project outline, it's recommended to use an `array` to act as the _queue_ for the `levelOrder` method. Whilst it would suffice for the purposes of this project, I wanted to take the opportunity to practice implementing a more efficient queue method seeing as queues were covered in a previous lesson in the course.

#### Arrays

Looking beyond the scope of this project, there are pros and cons for using built-in `array` methods for queuing:

_Pros:_

- Simplicity & Readability - there's no need for additional custom code and most develops will be familiar with the built in `push()` and `shift()` methods.
- Pre-built methods - Arrays come with a host of already-optimised built-in methods.
- Flexibility - JavaScript arrays are dynamic, meaning they can automatically resize as we add or remove elements.

_Cons:_

- Performance - Queues require regular addition and removal of elements. Whilst `push()` simply adds an element to the end of an array, meaning it has an average time complexity of $O(1)$, `shift()` is a bit more involved. When an element is removed from the front of an array, the remaining elements need to be reindexed, meaning the time complexity for `shift()` is $O(n)$. For large n, this could be an issue.

Whilst the performance drawback isn't an issue for this particular project, I wanted to practice trying to get around this limitation.

#### Custom Queues

To do so, I tried implementing a custom `Queue` class that utilises a fixed size array for the queue. Elements are then added to the queue in a circular nature so that both the `enqueue` and `dequeue` methods can directly reference the array indicies, meaning they _both_ have time complexity $O(1)$. But this type of implementation is not without it's drawbacks.

_Pros:_

- Efficient Performance - As previously stated, the addition and removal of elements from the queue has time complexity $O(1)$
- Memory Management - So long as you don't need to resize the underlying array, the memory allocated to it is more predictable.
- Fixed Capacity - The queue can be set up in such a way that it limits the number of elements that can be added to it.
  - Note: I have chosen to allow the array to double or halve in size depending on how many elements are present, but it should be possible to limit the number of elements.
- Complete Control - By defining a custom class you can control exactly how the queue will operate, meaning it can be tailored to better suit the implementation need.

_Cons:_

- More Complex - The implementation is more complex on two fronts.
  1. The logic - The 'wrapping' behaviour of the circular queue can be difficult to wrap your head around (pun intended). I've gone into a bit more detail about how this works in [circular queue logic](#circular-queue-logic).
  2. The code - The code itself is inherently more complex, thus maintaining (and debugging) the code becomes more challenging.
- No Built-in Methods - As the class is custom, there are no built-in methods, therefore any method required to manage and maintain the queue will require explicit implementation.
- Inflexible - In order for the queue to have circular logic, the size of the underlying array needs to be fixed.This makes the queue less flexible in one of two ways:
  1. If the queue size remains fixed, you need to decide and implement a way to handle the event of needing to add more queue items than the length of the queue permits.
  2. You allow the queue to be resizable, but then you need to handle how to reallocate existing queue items to the correct position in the new larger (or smaller) queue. This resizing operation has time complexity $O(n)$.
     - Note: This is the implementation I chose. To try and minimise the amount of times a user would encounter a queue needing to grow or shrink, I've added an additional parameter to `levelOrder(callback, queueLength)` which allows the user to set the **minimum** queue length (default of 16).

#### Circular Queue Logic

For me, the hardest part of this implementation was fully grasping the 'wrapping' nature of a circular queue. So I thought it was worth adding a brief explanation of how it works.

In my [Queue code](./queue.js), when a new queue is initialised several variables are assigned to the queue. For the circular logic, the important ones are

- `initialSize`: Which defines the length of the fixed-size array used to store the queue elements
- `head`: Which is a pointer to the first element in the queue
- `tail`: Which is a pointer to the last element in the queue

For this example, let's assume the queue is initialised with a size of 3. Once initialised, we will have an empty array with both `head` and `tail` pointing to the zeroth-element of the array

```javascript
Queue = [, ,];
head = 0;
tail = 0;
```

Let's say that we then add an element, `A`, to the queue

```javascript
Queue = ['A', ,];
head = 0;
tail = 1;
```

The newly added element will take up the first position in the queue. This means the next element to be inserted should be at `Queue[1]`, so `tail` increments to `1`. But since nothing has left the queue yet, `head` still points to the first element of the queue.

Now, let's say we add another element, `B`, to the queue (without dequeuing anything)

```javascript
Queue = ['A', 'B'];
head = 0;
tail = 2;
```

Now `tail` increments to the next spot in the queue again, which will be `Queue[2]`. But this is the final position in the queue, so what happens to `tail` once something else is added? Let's add another element, `C`, to the queue to understand what happens.

```javascript
Queue = ['A', 'B', 'C'];
head = 0;
tail = 0;
```

Now `tail` has returned to `0`, but why?

It's because the queue is a _fixed-length_. Under the hood, we need to ensure that both `head` and `tail` _always_ point to a _valid_ place in the queue. So instead of having `tail = i` for some value `i`, what we actually have is `tail = i % queueLength`.

So for the above example, what's happening is `tail` increments by 1, so `tail = 3`. But the queue length is 3, so we actually have `tail = 3 % 3 = 0`, which is how the queue follows circular logic.

#### Increasing the Queue Length

Continuing on from the above example, how would we add more values to the queue seeing as it's already full?

There are a couple of approaches that could be taken, but I've opted to allow for the queue to be resized. The upside of this approach is that we avoid overwriting any queue items when the queue gets full. However, the downside is that moving elements from the current queue to the new queue has time complexity $O(n)$ - so it's best to choose a suitable queue length initially to avoid constant resizing!

To better illustrate how this works, let's assume that following the previous example, we have dequeued `A` and enqueued `D`, so the current queue state is

```javascript
Queue = ['D', 'B', 'C'];
head = 1;
tail = 1;
```

Now, without allowing the queue to resize, if we were to enqueue another element _before_ we dequeue `B`, then `B` would be overwritten - which is something we want to avoid (hence the need to resize the queue).

To know when the queue needs to resize, I've added a check to at the start of the `enqueue` method that checks if the number of items in the queue is equal to its length. If this check returns `true` then it will double the size of the queue, correctly relocate the existing queue items to the new queue, and point `head` and `tail` to the correct array index.

This is how the resizing works:

It starts by defining a new empty array that's double the size of the current queue. For this example, the new queue will have 6 elements

```javascript
newQueue = [, , , , ,];
```

Then, for each element in the existing queue, allocate them to the **correct** position in the new queue. Recall that the existing queue state is

```javascript
Queue = ['D', 'B', 'C'];
head = 1;
tail = 1;
```

Since `head=1`, we know `B` is the first element in the queue, meaning the correct order needs to be `['B', 'C', 'D']`.  
To achieve this, we need to loop through the _current queue_ staring from the head, and assign it to a place in the new queue.

Before explaining how it works in detail, the code implementation looks like:

```javascript
const currentSize = 3;
const newSize = currentSize * 2;
const newQueue = new Array(newSize);

// Queue.count is the count of elements in the current queue
for (let i = 0; i < Queue.count; i += 1) {
  newQueue[i] = currentQueue[(head + i) % currentSize];
}
```

Let's go through how this applies to our example:

To begin:

```javascript
Queue = ['D', 'B', 'C'];
head = 1;
Queue.count = 3;
```

So, the first step of the loop will be when `i = 0`:

```javascript
newQueue[0] = currentQueue[(1 + 0) % 3];
```

Where `(1 + 0) % 3 = 1` so the new queue will be

```javascript
newQueue = ['B', , , , ,];
```

Then for `i = 1`

```javascript
// (1 + 1) % 3 = 2
newQueue[1] = currentQueue[2];
```

Which results in

```javascript
newQueue = ['B', 'C', , , ,];
```

And similarly, `i = 2` would yield

```javascript
newQueue = ['B', 'C', 'D', , ,];
```

With the existing queue items successfuly migrated to the new queue, there's some final steps to take care of.

```javascript
// overwrite the old queue with the new one
Queue = newQueue;

// Set the head to the first position of the new queue
head = 0;

// Set the tail to the first *open* position in the new queue
// Note that we can just use the element count here since an array is zero indexed
tail = Queue.count;
```

And with that, the following has been achieved:

- The queue has doubled in size
- The existing queue items have been migrated to the new queue _in the correct order_
- `head` correctly points to the first element of the queue
- `tail` correctly points to the next free spot in the queue
