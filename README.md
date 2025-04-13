# RewardsPOC

A React Native rewards system POC for ethically aligned purchases.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase:
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Update `src/lib/supabase.ts` with your credentials

3. Create the users table in Supabase:
```sql
create table public.users (
  id uuid primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

4. Start the development server:
```bash
npm start
```

## Project Structure

- `src/lib/supabase.ts` - Supabase client configuration
- `src/screens/RegisterScreen.tsx` - User registration screen
- `App.tsx` - Main application component

## Features

- User registration with email/password
- UUID generation for each user
- Supabase integration for data storage
- Basic error handling and loading states

## Next Steps

- Integration with Quiltt for bank account linking
- Implementation of transaction processing
- Points system implementation
- Rewards redemption functionality 