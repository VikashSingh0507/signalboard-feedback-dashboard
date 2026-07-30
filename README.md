# Signalboard

Signalboard is a small dashboard that helps a SaaS founder make sense of messy customer feedback.

The name reflects the product: it turns a noisy spreadsheet into useful customer signals. “Signal” is the pattern that matters; “board” is the simple place where the founder can see it.

## What the website does

The main dashboard shows:

- Total feedback received
- Unresolved feedback
- Low-rating feedback
- Unresolved enterprise feedback
- Recurring issue groups
- One recommended next step

There is also a landing page at `/landing.html`. Its job is to explain the product and send visitors to the dashboard.

## Run the project

You need Node.js 18+ and the private CSV provided with the assignment.

1. Put the CSV file here:

   ```text
   data/feedback_records.csv
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   node server.js
   ```

4. Open the dashboard:

   ```text
   http://localhost:3000
   ```

The landing page is available at:

```text
http://localhost:3000/landing.html
```

The CSV is not included in this repository because the assignment asks that the dataset remains private.

## Who I built it for

I built Signalboard for a B2B SaaS founder who has limited time before an investor update.

The question the dashboard answers is:

> Which unresolved customer problems should I investigate first?

I chose the founder perspective because they need a quick view of possible customer and revenue risk, rather than a detailed support queue. That is why the dashboard focuses on unresolved feedback, low ratings, enterprise accounts, recurring issues, and one clear recommendation.

## What I found and how I handled the data

The CSV contains inconsistent resolved values, blank ratings, duplicate records, blank messages, mixed date formats, and inconsistent labels.

I made these choices:

- I treat `yes`, `true`, and `1` as resolved.
- I do not count blank ratings as low ratings.
- I group unresolved messages with simple keyword rules for integrations, reporting, billing, performance, and access.
- Messages that do not match a rule remain visible as `Unclassified feedback` instead of being placed in an inaccurate category.

The dashboard found 36 unresolved enterprise conversations. Among the issues I could identify, integrations had the most unresolved feedback, so the dashboard recommends investigating integrations first.

I did not add date trends because the dates appear in several formats and the first version is focused on an immediate founder decision. I also did not automatically remove suspected duplicates because a simple rule could hide a real repeated complaint.

## How it works

The Node.js backend reads `data/feedback_records.csv` using `csv-parser`. It processes the data, creates a summary, and sends it as JSON through `/api/summary`.

The frontend uses `app.js` to request that summary and show it in `index.html`.

```text
CSV file → Node.js backend → /api/summary → app.js → dashboard
```

The CSV is never pasted directly into the browser. The backend reads and processes it first.

## Tradeoffs and improvements

I chose one focused dashboard instead of many charts and filters. I also used visible keyword rules instead of an opaque classifier, so the results are easier to explain.

The part I am least happy with is the large `Unclassified feedback` group. It is more honest than guessing a category, but it shows that the keyword rules are only a first pass.

With two more weeks, I would add safer duplicate detection, date validation and trends, a review flow for unclassified feedback, and example customer messages under each issue. I would also explore separate views for support leads and product managers.

## Landing-page experiment

I would A/B test the main button on the landing page.

I would compare `Open founder dashboard` with `Find your biggest customer risk`. I expect the second version to get more clicks because it explains the benefit more clearly. I would want around 1,000 qualified visitors seeing each version before trusting the result.

## AI use

I used AI for early layout ideas, copy options, and implementation details. I did not use every suggestion unchanged. I kept the product focused on one founder decision and used simple, visible keyword rules rather than a classifier that I could not explain.  