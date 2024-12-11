
  import java.util.List;
  class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

class ReverseLinkedList {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;  // Previous node, initially null
        ListNode curr = head;  // Current node, initially head
        ListNode next = null;  // Next node, initially null

        // Traverse the linked list and reverse the links
        while (curr != null) {
            next = curr.next;   // Save the next node
            curr.next = prev;   // Reverse the current node's pointer
            prev = curr;        // Move prev to the current node
            curr = next;        // Move to the next node
        }

        // At the end, prev points to the new head of the reversed list
        return prev;
    }
}

  public class user_code {
    public static ListNode createList(int[] values) {
    if (values.length == 0) return null;
    ListNode head = new ListNode(values[0]);
    ListNode current = head;
    for (int i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }
    return head;
}

public static boolean compareList(ListNode list, int[] expected) {
    int index = 0;
    while (list != null) {
        if (list.val != expected[index]) {
            return false;
        }
        list = list.next;
        index++;
    }
    return index == expected.length;
}

public static void main(String[] args) {
    ReverseLinkedList rll = new ReverseLinkedList();
    ListNode[] testCases = {
        createList(new int[] {1, 2, 3}),
        createList(new int[] {4, 5, 6, 7}),
        createList(new int[] {8})
    };
    int[][] expectedOutputs = {
        new int[] {3, 2, 1},
        new int[] {7, 6, 5, 4},
        new int[] {8}
    };

    for (int i = 0; i < testCases.length; i++) {
        ListNode reversed = rll.reverseList(testCases[i]);
        if (!compareList(reversed, expectedOutputs[i])) {
            System.out.println("Test case " + (i + 1) + ": Failed");
            return;
        }
    }
    System.out.println("All test cases passed.");
}
  }
  