# Rewards System POC To-Do Checklist

This checklist covers all major tasks for the Rewards System Feature POC. Use it to track progress and ensure nothing is missed.

---

## Frontend Tasks (React Native)

### Project Setup
- [x] **Initialize Project**
  - [x] Create a new React Native project (using Expo or React Native CLI) named **"RewardsPOC"**.
- [x] **Supabase Configuration**
  - [x] Install and configure the Supabase client library.
  - [x] Set up environment variables for connection to your Supabase instance.
- [x] **User Registration Screen**
  - [x] Create a registration screen.
  - [x] Generate a UUID for each new user.
  - [x] Store user records in Supabase's `users` table with at least the fields: `id` (UUID) and `created_at`.
  - [x] Include clear code comments and documentation.

### Bank Linking Integration with Quiltt
- [ ] **Embed Quiltt UI**
  - [ ] Implement a component that opens Quiltt's bank linking UI upon user action.
- [ ] **Handle Linking Success**
  - [ ] Retrieve the Quiltt user ID after a successful bank linking.
  - [ ] Update the corresponding user record in Supabase with the Quiltt user ID.
- [ ] **Error Handling**
  - [ ] Implement error handling for when the user cancels or the linking fails.
  - [ ] Add fallback logic notes for using Finicity primarily and MX as a fallback.

### User Points View & Redemption
- [ ] **Points Balance Screen**
  - [ ] Create a screen that displays the user's current points balance.
  - [ ]
