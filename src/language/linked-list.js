class _Node {
    constructor(value, next) {
        this.value=value,
        this.next=next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    getAll() {
        if(!this.head){
            return null;
        }

        let node = this.head;
        let allNodes = [];
        while (node.next) {
            allNodes.push(node.value);
            node = node.next;
        }

        allNodes.push(node.value);

        return allNodes;
    }

    insertFirst(item){
        this.head = new _Node(item, this.head);
    }

    insertLast(item){
        if(this.head === null){
            this.insertFirst(item);
        }
        else{
            let tempNode = this.head;
            while(tempNode.next !== null){
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }
    /**Inserts a new node after a node containing the key.*/
    insertAfter(key, itemToInsert){
        let tempNode = this.head;
        while(tempNode !== null && tempNode.value !== key){
            tempNode = tempNode.next;
        } 
        if(tempNode !== null){
            tempNode.next = new _Node(itemToInsert, tempNode.next);
        }  
    }
    /* Inserts a new node before a node containing the key.*/
    insertBefore(key, itemToInsert){
        if(this.head == null){
            return;
        }
        if(this.head.value == key){
            this.insertFirst(itemToInsert);
            return;
        }
        let prevNode = null;
        let currNode = this.head;
        while(currNode !== null && currNode.value !== key){
            prevNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null){
            console.log('Node not found to insert');
            return;
        }
        //insert between current and previous
        prevNode.next = new _Node(itemToInsert, currNode);
    }
    insertAt(nthPosition, itemToInsert) {
        if (nthPosition < 0) {
            throw new Error('Position error');
        }
        if (nthPosition === 0) {
            this.insertFirst(itemToInsert);
        }else {
            // Find the node which we want to insert after
            const node = this._findNthElement(nthPosition - 1);
            const newNode = new _Node(itemToInsert, null);
            newNode.next = node.next; 
            node.next = newNode;
        }
    }
    _findNthElement(position) {
        let node = this.head;
        for (let i=0; i<position; i++) {
            node = node.next;
        }
        return node;
    }
    remove(item){ 
        //if the list is empty
        if (!this.head){
            return null;
        }
        //if the node to be removed is head, make the next node head
        if(this.head.value === item){
            this.head = this.head.next;
            return;
        }
        //start at the head
        let currNode = this.head;
        //keep track of previous
        let previousNode = this.head;
        while ((currNode !== null) && (currNode.value !== item)) {
            //save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null){
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }
    find(item) { //get
        //start at the head
        let currNode = this.head;
        //if the list is empty
        if (!this.head){
            return null;
        }
        while(currNode.value !== item) {
            //return null if end of the list 
            // and the item is not on the list
            if (currNode.next === null) {
                return null;
            }
            else {
                //keep looking 
                currNode = currNode.next;
            }
        }
        //found it
        return currNode;
    }
}

function displayList(list){
    let currNode = list.head;
    while (currNode !== null) {
        console.log(currNode.value);
        currNode = currNode.next;
    }
}

function size(list){
    let counter = 0;
    let currNode = list.head;
    if(!currNode){
        return counter;
    }
    else
        counter++;
    while (!(currNode.next == null)) {
        counter++;
        currNode = currNode.next;
    }
    return counter;
}

function isEmpty(list){
    let currNode = list.head;
    if(!currNode){
        return true;
    }
    else {
        return false;
    }
}

function findPrevious(list, item) {
    let currNode = list.head;
    while ((currNode !== null) && (currNode.next.value !== item)) {
        currNode = currNode.next;
    }
    return currNode;
}

function findLast(list){
    if(list.head === null){
        return 'list is empty';
    } 
    let tempNode = list.head;
    while(tempNode.next !== null){
        tempNode = tempNode.next;
    }
      return tempNode;
}

module.exports = {
    LinkedList,
    displayList,
    size,
    isEmpty,
    findPrevious,
    findLast
};