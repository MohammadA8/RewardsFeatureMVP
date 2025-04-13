# Rewards System Feature POC Blueprint

This document provides a detailed, step-by-step blueprint for building the Rewards System Feature POC. The goal is to complete the proof-of-concept within 3 days, then use it as a foundation for integrating into a larger project.

---

## Overview

### Project Goals
Build an MVP rewards system for ethically aligned purchases using the following tech stack:

- **Frontend**: React Native  
- **Bank Linking**: [Quiltt](https://www.quiltt.io/) (Primary: Finicity, Fallback: MX via Quiltt)  
- **Backend**: Supabase  
- **Transaction Enrichment**: [Ntropy](https://www.ntropy.com/)  
- **Hosting & APIs**: Vercel (with Vercel Cron Jobs for polling)

### High-Level Workflow

1. **User Registration & Bank Account Linking**  
   - Create a user with a generated UUID and store it in Supabase.
   - Integrate Quiltt’s embeddable UI for secure bank account linking.

2. **Cron-Based Poller for Transaction Matching & Points Allocation**  
   - Set up a serverless function (deployed on Vercel) triggered by a cron job.
   - Fetch users with linked bank accounts, retrieve their transactions via Quiltt’s API, and enrich transactions using Ntropy.
   - Match transactions to ethical businesses in Supabase and award points accordingly.

3. **User Points View & Redemption**  
   - Develop a React Native screen that displays the user’s current points balance.
   - List redeemable rewards and handle redemption transactions atomically.

4. **Business & Admin Configuration**  
   - Configure ethical businesses in Supabase (to be managed manually via the Supabase dashboard in the MVP).

5. **Error Handling & Integration**  
   - Implement error handling for bank linking, transaction processing, duplicate processing, points cap, and atomic redemption transactions.

---

## Detailed Iterative Prompts

Each prompt below is self-contained and builds on previous work. Use these sequentially to generate the code and fully integrate the project.

---

### Prompt 1: Project Setup & Environment Configuration

```text
[Prompt 1: Environment Setup & Basic React Native Project Initialization]

You are tasked with setting up the foundational environment for the rewards system POC. Follow these steps:

1. Initialize a new React Native project (using Expo or React Native CLI) named "RewardsPOC".
2. Setup a connection to Supabase:
   - Install the Supabase client library.
   - Configure the project to connect to a Supabase project.
3. Create a basic user registration screen:
   - When the user registers, generate a UUID (use any UUID library).
   - Store the user record in Supabase's 'users' table with at least the fields: `id` (UUID), and `created_at`.
4. Include clear documentation and separation of concerns in the code.

Make sure the code is modular and ready for further integration (e.g., later incorporating Quiltt bank linking).

Please output the React Native project initialization code, Supabase configuration, and the user registration screen implementation.
```

### Prompt 2: Bank Linking Integration with Quiltt
```
[Prompt 2: Integrate Quiltt for Bank Account Linking]

Building on the initial setup, now integrate the Quiltt bank linking process. Here are the requirements:

1. Embed the Quiltt UI in your React Native app:
   - Implement a component that, upon user action, opens Quiltt's bank linking interface.
2. On successful bank account linking:
   - Retrieve the Quiltt user ID.
   - Update the corresponding user record in Supabase with the Quiltt user ID.
3. Include fallback logic notes: Use Finicity as the primary provider and MX as a fallback if needed.
4. Ensure error handling in case the user cancels or the linking fails.
5. Write clear comments and prepare the code so that it can be extended later.

Please output the React Native code for integrating Quiltt’s embeddable UI along with the functions to update the Supabase user record after a successful bank link.

```

### Prompt 2: Bank Linking Integration with Quiltt
```
[Prompt 3: Setup the Cron Job Poller Backend]

Switching to the backend, implement a serverless function to serve as a poller triggered by Vercel Cron Jobs. This function must:

1. Connect to Supabase and retrieve all users who have a Quiltt user ID (i.e., those who linked their bank accounts).
2. For each user, fetch recent transactions from the Quiltt API (simulate the fetching if a real API isn’t available).
3. Structure the code so that it can call an external service (Ntropy) later for transaction enrichment.
4. Write logs for debugging and include basic error handling for API calls and database operations.

Make sure the code is well modularized, with separate functions for:
   - Fetching user records from Supabase.
   - Fetching transactions from Quiltt.
   - Preparing the data for enrichment.

Please output the serverless function code in Node.js that performs these tasks, ready to be deployed on Vercel.
```

### Prompt 4: Transaction Enrichment and Matching Logic

```
[Prompt 4: Implement Transaction Enrichment and Matching]

Enhance the backend poller function with the following logic:

1. For each transaction fetched:
   - Call the Ntropy API to enrich the transaction details (e.g., merchant name, category). (You can simulate the Ntropy API response for this POC.)
2. Query the `ethical_businesses` table in Supabase to determine if the enriched merchant name matches any configured ethical business.
3. If a match is found:
   - Calculate the points to award based on the business’s "points-per-dollar" configuration.
   - Ensure that points do not exceed the monthly cap for that user for that specific business.
4. Record the awarded points in a new table called `user_points`, ensuring that the transaction ID is marked as processed to avoid duplicate processing.
5. Log each matched and processed transaction.

Make sure the logic is divided into clear functions and is easily testable. Provide the Node.js code that implements these steps.
```

### Prompt 5: User Points View and Rewards Redemption in the Frontend

```
[Prompt 5: Develop User Points Display & Redemption Interface]

On the frontend side (React Native), implement the following features:

1. Create a screen to display the user's current points balance:
   - Query the backend (Supabase) to retrieve the aggregated points from the `user_points` table.
   - Refresh the balance at least once per day (or after the backend poller has run).
2. Implement a rewards list:
   - Display a list of rewards (e.g., gift cards, donation options) with the points required for redemption.
   - If the user’s balance meets the threshold, enable the reward button; otherwise, show it as disabled.
3. Develop the redemption logic:
   - On clicking a reward, trigger a backend API request that attempts an atomic redemption transaction (i.e., deduct points and grant the reward).
   - Handle the case where the user's points may have been reduced by concurrent operations.
4. Include error messages and validations on both the UI and via backend responses.

Provide the React Native code for the points view screen and the associated network calls to support redemption.

```

### Prompt 6: Backend Endpoint for Points Redemption (Atomic Transaction Handling)
```
[Prompt 6: Implement Atomic Redemption Endpoint]

Now focus on the backend code for handling reward redemption. This function should:

1. Accept a request containing the user ID, chosen reward identifier, and current points balance.
2. Validate that the user has sufficient points:
   - Recheck and lock the user's points data to avoid concurrent race conditions.
3. Deduct the points and record the redemption transaction in the database in an atomic operation.
4. Return a clear success or error response based on the operation.
5. Include logging and error handling for scenarios where points are insufficient or if the transaction fails.

Please output the Node.js code for the redemption endpoint ensuring that operations are performed atomically.

```

### Prompt 7: Integration and End-to-End Testing Wire-Up
```
[Prompt 7: Wire Up All Components and Conduct End-to-End Testing]

Now that the individual components are complete, integrate them into one working flow. This includes:

1. Connecting the React Native frontend with the backend APIs for:
   - User registration and bank linking.
   - Polling-triggered transaction processing and points awarding.
   - Points balance retrieval and reward redemption.
2. Ensuring the backend serverless functions (for the poller and redemption endpoint) are deployed to Vercel and scheduled appropriately.
3. Writing test scripts (or manual test flows) that simulate:
   - A user registration, bank linking, simulated transactions, and subsequent awarding of points.
   - The user’s redemption process through the app, ensuring that atomicity is enforced.
4. Including logging in all parts of the system to trace data flow and help with debugging.

Provide a comprehensive integration plan along with the code or instructions that wire all the components together. Explain how manual testing should be conducted to simulate the end-to-end workflow.

```

### Prompt 8: Final Documentation and Error Handling Enhancements
```
[Prompt 8: Final Documentation and Robust Error Handling]

Finally, ensure that the codebase is maintainable and robust. Update the documentation and error handling as follows:

1. Write a clear README that outlines:
   - Project setup instructions.
   - Environment variable configuration for Supabase, Quiltt, and Ntropy.
   - How to deploy the backend functions on Vercel.
   - How to run the React Native app and test the features.
2. Expand error handling:
   - Add logging for critical errors (e.g., bank linking failures, API call issues, transaction conflicts).
   - Include fallback and retry logic where applicable (e.g., exponential backoff on polling failures).
3. Review and refactor code to ensure:
   - Modularity of components.
   - No dangling functionality remains unintegrated.
   - Test coverage for critical modules (even if only via manual tests).

Output the final documentation (README) draft and any additional code modifications that enhance error handling and robustness.

```