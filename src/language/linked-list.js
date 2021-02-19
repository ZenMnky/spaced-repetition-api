class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // return all nodes
  all() {
    if (!this.head) {
      return null;
    }

    let node = this.head;
    const allNodes = [];
    while (node.next) {
      allNodes.push(node.value);
      node = node.next;
    }

    allNodes.push(node.value);

    return allNodes;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  // build the linked list
  insert(item) {
    if (this.head === null) {
      this.head = new _Node(item, null);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new _Node(item, null);
    }
  }

  /** Correct response handling
   * If user's guess is correct
   * double the corresponding memory-value (M)
   * increment the correct-count value of the node by 1
   * change node's position: move the question back M places in the linked list
   *
   */
  correct() {
    let currentNode = this.head;
    const tempNode = this.head;
    let positionCount = 0;
    let newPosition = 0;

    currentNode.value.memory_value *= 2;
    newPosition = currentNode.value.memory_value;
    currentNode.value.correct_count++;

    while ((currentNode.next) && (positionCount !== newPosition)) {
      currentNode = currentNode.next;
      positionCount++;
    }

    this.head = this.head.next;
    tempNode.next = currentNode.next;
    currentNode.next = tempNode;

    tempNode.value.next = (!tempNode.next) ? null : tempNode.next.value.id;
    currentNode.value.next = tempNode.value.id;
    this.head.value.next = this.head.next.value.id;
  }

  /** Incorrect response handling
   * If user's guess is incorrect
   * set the memory-value (M) to 1
   * increment the incorrect-count value of the node by 1
   * change node's position: move the question back M places in the linked list
   */
  incorrect() {
    const currNode = this.head;
    const upNextNode = this.head.next;
    const tempNode = upNextNode.next;

    currNode.value.memory_value = 1;
    currNode.value.incorrect_count++;

    this.head = upNextNode;
    this.head.next = currNode;
    currNode.next = tempNode;

    upNextNode.value.next = currNode.value.id;
    currNode.value.next = tempNode.value.id;
  }
}

module.exports = LinkedList;
