async function loadSummary() {
  const response = await fetch("/api/summary");
  const data = await response.json();
  

  document.getElementById("total-feedback").textContent =
    data.totalFeedback;

  document.getElementById("unresolved-feedback").textContent =
    data.unresolvedFeedback;

  document.getElementById("low-rating-feedback").textContent =
    data.lowRatingFeedback;

  document.getElementById("enterprise-unresolved").textContent =
    data.enterpriseUnresolved;

    const issueList = document.getElementById("issue-list");
    const knownIssues = Object.entries(data.issueCounts)
    .filter(([issue]) => issue !== "Unclassified feedback")
    .sort((a, b) => b[1] - a[1]);

    const [topIssue, topCount] = knownIssues[0];

    document.getElementById("recommendation-text").textContent =
    "Investigate " + topIssue.toLowerCase() +
    " first: " + topCount + " unresolved conversations.";

    Object.entries(data.issueCounts).forEach(([issue, count]) => {
    issueList.innerHTML += `<p>${issue}: ${count}</p>`;
});
}

loadSummary();