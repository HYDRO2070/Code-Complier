
  class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function reverseList(head) {
    let prev = null;  // Previous node, initially null
    let curr = head;  // Current node, initially head
    let next = null;  // Next node, initially null

    // Traverse the linked list and reverse the links
    while (curr !== null) {
        next = curr.next;  // Save the next node
        curr.next = prev;  // Reverse the current node's pointer
        prev = curr;       // Move prev to the current node
        curr = next;       // Move to the next node
    }

    // At the end, prev points to the new head of the reversed list
    return prev;
}

  function createList(values) {
    if (values.length === 0) return null;
    let head = new ListNode(values[0]);
    let current = head;
    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }
    return head;
}

function compareList(list, expected) {
    let index = 0;
    while (list !== null) {
        if (list.val !== expected[index]) {
            return false;
        }
        list = list.next;
        index++;
    }
    return index === expected.length;
}

let testCases = [
    createList([1, 2, 3]),
    createList([4, 5, 6, 7]),
    createList([8])
];
let expectedOutputs = [
    [3, 2, 1],
    [7, 6, 5, 4],
    [8]
];

testCases.forEach((testCase, index) => {
    let reversed = reverseList(testCase);
    if (!compareList(reversed, expectedOutputs[index])) {
        console.log(`Test case ${index + 1}: Failed`);
        process.exit(0);
    }
});
console.log("All test cases passed.");
  