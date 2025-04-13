# 🧾 Rewards System Feature Specification (POC)

This document outlines the detailed functional and architectural specification for a rewards system tied to ethically aligned purchases, optimized for fast delivery in a React Native app using the following stack. This is a POC project I will build in a max 3 days and convert into an app aftrer checking that it's feasable.

---

## 🧱 Tech Stack

- **Frontend**: React Native  
- **Bank Linking**: [Quiltt](https://www.quiltt.io/) (primary: Finicity, fallback: MX via Quiltt)  
- **Backend**: Supabase  
- **Transaction Enrichment**: [Ntropy](https://www.ntropy.com/)  
- **Hosting & APIs**: Vercel (including [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) for polling logic)

---

## 🧩 System flow

We’ve organized the MVP feature set into three main operational stages:

---

## 1. 👤 User Registration & Bank Account Linking

### Objective:
Let users sign up and securely link their bank accounts via Quiltt so the app can analyze their transactions.

### Behavior:

- Upon registration:
  - Generate a **UUID** to represent the user in the app and in Quiltt.
  - Save this UUID in Supabase’s `users` table.
  - Use Quiltt to initiate bank linking via Finicity (fallback to MX if needed).
- Once linking is complete:
  - Store Quiltt user ID in Supabase under the corresponding app user record.
- Quiltt handles secure linking through their embeddable UI.
- This UUID will later be used by the backend poller (see below) to fetch and process transactions for this user.

---

## 2. 🔁 Cron-Based Poller: Transaction Matching & Point Allocation

### Objective:
Regularly scan users' recent transactions and award points when purchases match an ethical business.

### Process:

- **Trigger**:  
  - Daily via [Vercel Cron Jobs].
  - Possible MVP alternatives:
    1. Trigger on app open (if polling hasn’t happened in 24 hours).
    2. Button in app: “Do I have any new points?”
    3. In future: listen to Quiltt webhooks for real-time ingestion.

- **Flow**:
  1. Fetch all users who have a Quiltt user ID (i.e., have linked their bank accounts).
  2. For each user, fetch recent transactions from Quiltt.
  3. Use **Ntropy** to enrich and classify transactions (get merchant names, categories).
  4. Attempt to match each transaction’s enriched merchant name against entries in the `ethical_businesses` table (Phase 0: name-based heuristic only).
  5. If a match is found:
     - Use business-specific configuration (from the `ethical_businesses` table) to determine how many points to award.
     - Points awarded will be stored in a `user_points` or similar table.

### Matching Notes:
- Matching logic is basic for Phase 0 and will evolve.
- Transactions are only processed once — transaction IDs are deduplicated to avoid double processing.

### Points System:
- Points are awarded using the configured **“points per dollar”** rate, e.g., `$5 = 2 points`.
- Points cap per business is enforced:
  - Points beyond the cap will not be awarded.
  - System logs capped-out events for later review.
- Points are stored as **integer values** and treated as equivalent to **cents**.

---

## 3. 🎁 User Points View & Redemption

### Objective:
Allow users to view and redeem their points for rewards like gift cards and charitable donations.

### Behavior:

- **Points Balance Display**:
  - Users will see a total point balance (no per-transaction breakdown in MVP).
  - Display updates **daily** (after polling).
- **Redemption Options**:
  - Users can browse rewards (gift cards, donation causes).
  - Each reward shows the required number of points to redeem it.
  - If a user has enough points, the reward button is enabled.
  - If they don’t, the reward button is **greyed out** (not clickable).
    - No separate notification will be triggered.
    - Alternative rewards that are affordable may be shown.
- **Redemption Transaction**:
  - Points deduction and reward grant are **atomic**.
  - Race conditions are avoided by wrapping the transaction in a single operation.

---

## 🧠 Business & Admin Configuration

- All configuration data lives in Supabase:
  - `ethical_businesses` table includes:
    - Business name
    - Points-per-dollar rate
    - Monthly cap per user
    - Business category or tags (future use)
- Admins (you) will manage this table manually via Supabase dashboard in MVP.
- Future phase: Admin UI for business partners to onboard/edit their own configurations.

---

## ⚠️ Error Handling & Edge Cases

### 1. Quiltt Linking Errors
- If linking fails (timeout, user cancels), show a friendly retry message.
- Log metadata (user ID, error type, time) for admin review.

### 2. Incomplete or Missing Transaction Data
- Try to enrich with Ntropy.
- If still unusable, log it and skip point awarding.

### 3. Duplicate Processing
- Poller tracks and skips already-processed transaction IDs.

### 4. Points Cap
- If transaction exceeds the monthly cap, award only up to the cap.
- Excess points are logged but not awarded.

### 5. Redemption Issues
- If user no longer has enough points during redemption (e.g., due to concurrency):
  - Show error message and refresh points.
  - Prevent race condition by ensuring atomic transaction logic.

### 6. Cron Job Failures
- Retry up to 3 times on failure (exponential backoff).
- Log failure and optionally notify admin (e.g., via Cronitor or Supabase function).

### 7. Misconfigured Businesses
- If an ethical business lacks a valid config, skip it and log a warning.
- Will surface later in the admin dashboard (Phase 1).
