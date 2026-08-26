const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || "feedback_records.csv";

function isResolved(value) {
  const cleanedValue = value?.trim().toLowerCase();

  return ["yes", "true", "1"].includes(cleanedValue);
}
function getIssue(message) {
  const text = message?.toLowerCase() || "";

  if (
    text.includes("permission") ||
    text.includes("role-based") ||
    text.includes("access") ||
    text.includes("login")
  ) {
    return "Access & permissions";
  }

  if (
    text.includes("report") ||
    text.includes("export") ||
    text.includes("analytics")
  ) {
    return "Reporting & exports";
  }

  if (
    text.includes("slow") ||
    text.includes("crash") ||
    text.includes("bug") ||
    text.includes("error")
  ) {
    return "Performance & reliability";
  }

  if (
    text.includes("billing") ||
    text.includes("invoice") ||
    text.includes("price") ||
    text.includes("charged")
  ) {
    return "Billing & plans";
  }

  if (
    text.includes("integration") ||
    text.includes("api") ||
    text.includes("slack") ||
    text.includes("webhook")
  ) {
    return "Integrations";
  }

  return "Unclassified feedback";
}

// Lets the browser access files inside the public folder.
app.use(express.static(path.join(__dirname, "public")));

// Reads the feedback CSV and sends it to the frontend.
/* app.get("/api/feedback", (req, res) => {
  const feedback = [];

  fs.createReadStream(
    path.join(__dirname, "data", DATA_FILE)
  )
    .pipe(csv())
    .on("data", (row) => {
      feedback.push(row);
    })
    .on("end", () => {
      res.json(feedback);
    });
}); */

app.get("/api/summary", (req, res) => {
  const feedback = [];

  fs.createReadStream(
  path.join(__dirname, "data", DATA_FILE)
  )
    .pipe(csv())
    .on("data", (row) => {
      feedback.push(row);
    })
    .on("end", () => {
      const unresolved = feedback.filter((row) => {
      return !isResolved(row.resolved);
      });

      const issueCounts = {};
      unresolved.forEach((row) => {
      const issue = getIssue(row.message);
      if (issueCounts[issue]) {
      issueCounts[issue] += 1;
      }   
      else {
      issueCounts[issue] = 1;
      }
      });
      const lowRating = feedback.filter((row) => {
      const rating = row.rating?.trim();

        return rating !== "" && Number(rating) <= 2;
      });

      const enterpriseUnresolved = unresolved.filter((row) => {
        return row.plan_tier?.trim().toLowerCase() === "enterprise";
      });

      res.json({
      totalFeedback: feedback.length,
      unresolvedFeedback: unresolved.length,
      lowRatingFeedback: lowRating.length,
      enterpriseUnresolved: enterpriseUnresolved.length,
      issueCounts: issueCounts
    });
    });
});
// Starts the local server.
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});