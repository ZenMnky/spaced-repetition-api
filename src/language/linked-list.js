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
    // if there is no head, there is no linked list.
    if (!this.head) {
      return null;
    }

    let node = this.head;
    const allNodes = [];

    // while there is a next node,
    // add the current node to the array allNodes
    // point 'node' to the next node in the list, and continue the process
    while (node.next) {
      allNodes.push(node.value);
      node = node.next;
    }

    // add the last node to the list, the one without a node.next truthy value
    allNodes.push(node.value);

    return allNodes;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  // build the linked list
  insert(item) {
    // if there is no node head, create one
    if (this.head === null) {
      this.head = new _Node(item, null);
    } else {
      // traverse through the linked list
      // until we reach the end, where the next value is null
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      // create a new node at the end of the linked list
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
    /** overall plan: 
     * Traverse the Linked list upto positionCount nodes.
        Once all the positionCount nodes are traversed, allocate memory and the given data to the new node.
        Point the next pointer of the new node to the next of current node.
        Point the next pointer of current node to the new node.
     */

    let currentNode = this.head;
    let tempNode = this.head;
    let positionCount = 0;
    let newPosition = 0;

    // double the memory-value key-value of the head node
    currentNode.value.memory_value = (currentNode.value.memory_value * 2);
    // assign the number of places to move the question back in the list by to 'newPosition'
    newPosition = currentNode.value.memory_value;
    // increment the correct-count of the head node by one
    currentNode.value.correct_count = currentNode.value.correct_count + 1;

    // while there is still a truthy next node
    // and the positionCount is not equal to the newPosition counter, 
    // traverse through the list, incrementing the counter variable each time
    while ((currentNode.next) && (positionCount !== newPosition)) {
      currentNode = currentNode.next;
      positionCount = positionCount + 1;
    }

    // update the head to the second item in the linked list, 
    // because we're moving the position of the head node
    this.head = this.head.next;
    // tempNode is a clone of the previous head node,
    // the node we're changing position
    // begin linking it into the list by assigning it's next value
    // to the node after where we want it to be in our list
    tempNode.next = currentNode.next;
    //update the value of the currentNode to point at our newly inserted node, 'tempNode'
    currentNode.next = tempNode;

    // update the next-node id-value of our newly shifted node
    // if there is no next node, assign 'null', otherwise assign the value of id
    tempNode.value.next = (!tempNode.next) ? null : tempNode.next.value.id;
    // update the next-node id-value of 'currentNode', the node in-front of tempNode, to point at tempNode's id value
    currentNode.value.next = tempNode.value.id;
    // update the next-node id-value of the new head node to point at the id value of the next lined node
    this.head.value.next = this.head.next.value.id;
  }

  /** Incorrect response handling
   * If user's guess is incorrect
   * set the memory-value (M) to 1
   * increment the incorrect-count value of the node by 1
   * change node's position: move the question back M places in the linked list
   */
  incorrect() {
    const currentNote = this.head;
    const nextNode = this.head.next;
    const tempNode = nextNode.next;

    currentNote.value.memory_value = 1;
    currentNote.value.incorrect_count = currentNote.value.incorrect_count + 1;

    // reassign head to point at the node in the second position
    this.head = nextNode;
    // the newly appointed head, formerly the node in second position
    // set it's next value to point at the former head node
    this.head.next = currentNote;
    // former head node, now in second position
    // assign it's next value to 'tempNode', the node that was originally in third position in the linked list
    currentNote.next = tempNode;

    // update the next-node id-value of nextNode, now in the head position
    // to point at the id value of currentNode, now in the second position in the list
    nextNode.value.next = currentNote.value.id;
    // update the next-node id-value of currentNode, our former head, now in second position
    // to the id value of tempNode, the node in the third position in our linked list
    currentNote.value.next = tempNode.value.id;
  }
}

module.exports = LinkedList;
