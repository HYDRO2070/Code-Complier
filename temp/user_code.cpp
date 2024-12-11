
  #include <bits/stdc++.h>
  using namespace std;

  #include <vector>
#include <unordered_map>
using namespace std;

class TwoSumSolver {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap; // Map to store the complement and its index
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i; // Store the current number's index
        }
        return {}; // Return empty vector if no solution found
    }
};

  int main() {
    TwoSumSolver solver;
    vector<pair<vector<int>, int>> testCases = {{{3, 3}, 6}, {{5, 5, 1, 3, 2}, 10}}; vector<vector<int>> expectedResults = {{0, 1}, {0, 1}}; 

    for (int i = 0; i < testCases.size(); ++i) {
        vector<int> result = solver.twoSum(testCases[i].first, testCases[i].second);
        if (result != expectedResults[i]) {
           cout << "Test case " << i + 1 << ": Failed" << endl;
            return 0;
        }
    }
    cout << "All test cases passed." << endl;
    return 0;
}
  