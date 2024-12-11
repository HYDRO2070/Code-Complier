class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class ReverseLinkedList:
    def reverseList(self, head):
        prev = None  # Initialize the previous node as None
        curr = head  # Start with the head of the list
        next = None  # Temporary pointer for the next node

        while curr is not None:
            next = curr.next  # Save the next node
            curr.next = prev   # Reverse the current node's pointer
            prev = curr        # Move the prev pointer to the current node
            curr = next        # Move the curr pointer to the next node

        # At the end, prev points to the new head of the reversed list
        return prev

def create_list(values):
    if not values:
        return None
    head = ListNode(values[0])
    current = head
    for value in values[1:]:
        current.next = ListNode(value)
        current = current.next
    return head

def compare_list(linked_list, expected):
    index = 0
    while linked_list is not None:
        if linked_list.val != expected[index]:
            return False
        linked_list = linked_list.next
        index += 1
    return index == len(expected)

if __name__ == "__main__":
    test_cases = [
        create_list([1, 2, 3]),
        create_list([4, 5, 6, 7]),
        create_list([8])
    ]
    expected_outputs = [
        [3, 2, 1],
        [7, 6, 5, 4],
        [8]
    ]

    rll = ReverseLinkedList()
    for i, test_case in enumerate(test_cases):
        reversed_list = rll.reverseList(test_case)
        if not compare_list(reversed_list, expected_outputs[i]):
            print(f"Test case {i + 1}: Failed")
            exit(0)
    print("All test cases passed.")